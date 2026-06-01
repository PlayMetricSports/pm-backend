/* eslint-disable no-undef */
const { getMessaging } = require('firebase-admin/messaging');
const { DeviceToken } = require('@/models/app/deviceToken.model');

/**
 * Sends push notifications to a list of users
 * 
 * @param {Array<string>} user_ids - Array of user IDs to send notifications to
 * @param {string} title - Notification title
 * @param {string} body - Notification message body
 * @param {Object} [options={}] - Optional notification configuration
 * @param {string} options.image - URL to image to display in notification
 * @param {string} options.clickAction - Action when notification is clicked
 * @param {boolean} options.silent - Whether notification should be silent
 * @param {string} options.sound - Sound to play with notification (e.g., "default" or custom sound filename)
 * @returns {Promise<Object>} Result of the notification send operation
 */
exports.sendNotificationToUsers = async (user_ids, title, body, options = {}) => {
    try {
        // Validate inputs
        if (!Array.isArray(user_ids) || user_ids.length === 0) {
            throw new Error('User IDs must be a non-empty array');
        }

        if (!title || !body) {
            throw new Error('Notification title and body are required');
        }

        // Fetch active device tokens for the specified users
        const deviceTokens = await DeviceToken.find({
            user_id: { $in: user_ids },
            is_active: true
        }).lean();

        if (!deviceTokens || deviceTokens.length === 0) {
            return {
                code: 404,
                success: false,
                error: [
                    {
                        field: "deviceTokens",
                        message: "No active device tokens found for the specified users."
                    }
                ],
                message: ""
            };
        }

        // Extract registration tokens
        const registrationTokens = deviceTokens.map(device => device.token);

        body = body.replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Build notification message
        const message = {
            notification: {
                title,
                body,
                ...options.image && { imageUrl: options.image }
            },
            tokens: registrationTokens,
            // Add optional configuration
            ...options.clickAction && { webpush: { fcmOptions: { link: options.clickAction } } },
            ...options.silent && { apns: { payload: { aps: { 'content-available': 1 } } } }
        };

        // Add sound configuration for iOS (APNS)
        if (options.sound && !options.silent) {
            if (!message.apns) {
                message.apns = { payload: { aps: {} } };
            } else if (!message.apns.payload) {
                message.apns.payload = { aps: {} };
            } else if (!message.apns.payload.aps) {
                message.apns.payload.aps = {};
            }

            message.apns.payload.aps.sound = options.sound;
        }

        // Add sound configuration for Android
        if (options.sound && !options.silent) {
            if (!message.android) {
                message.android = { notification: {} };
            } else if (!message.android.notification) {
                message.android.notification = {};
            }

            message.android.notification.sound = options.sound;
        }

        // Send the multicast message
        const response = await getMessaging().sendEachForMulticast(message);

        // Get the failed tokens from the responses
        const failedTokens = response.responses
            .map((resp, idx) => resp.success ? null : registrationTokens[idx])
            .filter(token => token !== null);

        const updatePromises = response.responses
            .filter(resp => resp.success)
            .map((resp, idx) =>
                DeviceToken.findOneAndUpdate(
                    { token: registrationTokens[idx] },
                    { $set: { last_used_at: new Date() } }
                )
            );

        await Promise.all(updatePromises);
        return {
            code: 200,
            success: true,
            data: {
                successCount: response.successCount,
                failureCount: response.failureCount,
                failedTokens: failedTokens
            },
            error: [],
            message: `Notification sent successfully to ${response.successCount} devices`
        };
    } catch (error) {
        return {
            code: 500,
            success: false,
            error: [
                {
                    field: "notification",
                    message: error.message || "Failed to send notifications"
                }
            ],
            message: ""
        };
    }
};