const mongoose = require('mongoose');

/**
 * Validates object fields based on required presence and ObjectId format.
 *
 * @param {Object} fields - Object with field values to validate.
 * @param {Array} requiredFields - Array of field names that are required and must be valid ObjectIds.
 * @param {Array} optionalFields - Array of field names that are optional but must be valid ObjectIds if provided.
 * @returns {Array} - List of validation error objects.
 */


const validateObjectIdFields = (fields, requiredFields = [], optionalFields = []) => {
    const errors = [];

    for (const field of requiredFields) {
        if (!fields[field] || !mongoose.isValidObjectId(fields[field])) {
            errors.push({
                field,
                message: `${field} is required and must be a valid ObjectId.`
            });
        }
    }

    for (const field of optionalFields) {
        if (fields[field] && !mongoose.isValidObjectId(fields[field])) {
            errors.push({
                field,
                message: `${field} must be a valid ObjectId if provided.`
            });
        }
    }

    return errors;
};

module.exports = validateObjectIdFields