const { ValidateQueryFiltersAndInsert, ValidateNonEmptyElements, ValidateMongooseObjectIds } = require("@/validators/main/validator/multivalidator.js")
const { createSuccessResponse, createErrorResponse } = require('@/utils/helpers/errorFormat/errorFormatter');
const STATUS_CODES = require('@/utils/helpers/statusCodes.helper')
const handleCatchError = require("@/utils/middleware/errorHandler.middleware")

const Booking = require("@/models/organisation/booking.model");

const GetDashboardDataController = async (request, response) => {
    const userOrgId = request.user?.orgId?._id
    let matchCondition = {
        status: { $in: ["rescheduled", "scheduled"] },
    }
    try {
        if (userOrgId && ValidateMongooseObjectIds(userOrgId)) {
            matchCondition.orgId = userOrgId
        }
        else {
            const { orgId } = request.query
            if (orgId && ValidateMongooseObjectIds(orgId)) {
                matchCondition.orgId = orgId
            }
        }
    }
    catch (userOrgError) {
        console.error(userOrgError)
        return response.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(createErrorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, "userOrgError", userOrgError.message))
    }

    const { venueId, sportId, courtId, duration } = request.query
    const error = ValidateNonEmptyElements({ duration })
    if (error.length > 0) {
        return response.status(STATUS_CODES.NOT_FOUND).json(createErrorResponse(STATUS_CODES.NOT_FOUND, error[0].field, error[0].message))
    }
    if (duration === "today") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        matchCondition.bookingDate = {
            $gte: start,
            $lt: end,
        };
    }
    else if (duration === "lastWeek") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 7);

        matchCondition.bookingDate = {
            $gte: start,
        };
    }
    else if (duration === "lastMonth") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setMonth(start.getMonth() - 1);

        matchCondition.bookingDate = {
            $gte: start,
        };
    }

    matchCondition = { ...matchCondition, ...ValidateQueryFiltersAndInsert({ venueId, sportId, courtId }) }
    const revenueAndBookingpipeline = [
        {
            $match: matchCondition
        },
        {
            $lookup: {
                from: "venues",
                localField: "venueId",
                foreignField: "_id",
                as: "venue"
            }
        },
        { $unwind: "$venue" },

        {
            $lookup: {
                from: "sports",
                localField: "sportId",
                foreignField: "_id",
                as: "sport"
            }
        },
        { $unwind: "$sport" },

        {
            $lookup: {
                from: "courts",
                localField: "courtId",
                foreignField: "_id",
                as: "court"
            }
        },
        { $unwind: "$court" },
        {
            $group: {
                _id: {
                    TPA: "$TPA",
                    venueId: "$venue._id",
                    sportId: "$sport._id",
                    courtId: "$court._id"
                },
                venue: { $first: "$venue" },
                sport: { $first: "$sport" },
                court: { $first: "$court" },

                bookingCount: { $sum: 1 },
                totalAmount: { $sum: "$finDetails.totalAmount" }
            }
        },
        {
            $group: {
                _id: {
                    TPA: "$_id.TPA",
                    venueId: "$_id.venueId",
                    sportId: "$_id.sportId"
                },
                venue: { $first: "$venue" },
                sport: { $first: "$sport" },

                sportTotalAmount: { $sum: "$totalAmount" },
                sportActiveBookings: { $sum: "$bookingCount" },
                courts: {
                    $push: {
                        _id: "$court._id",
                        courtName: "$court.courtName",
                        courtNumber: "$court.courtNumber",
                        isMultipurpose: "$court.isMultipurpose",
                        bookingCount: "$bookingCount",
                        totalAmount: "$totalAmount"
                    }
                }
            }
        },
        {
            $group: {
                _id: {
                    TPA: "$_id.TPA",
                    venueId: "$_id.venueId"
                },
                venue: { $first: "$venue" },

                venueTotalAmount: { $sum: "$sportTotalAmount" },
                venueActiveBookings: { $sum: "$sportActiveBookings" },

                sports: {
                    $push: {
                        _id: "$sport._id",
                        name: "$sport.name",
                        totalAmount: "$sportTotalAmount",
                        courts: "$courts"
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id.TPA",

                tpaTotalAmount: { $sum: "$venueTotalAmount" },
                tpaActiveBookings: { $sum: "$venueActiveBookings" },

                venues: {
                    $push: {
                        _id: "$venue._id",
                        name: "$venue.name",
                        totalAmount: "$venueTotalAmount",
                        sports: "$sports"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                TPA: "$_id",
                totalAmount: "$tpaTotalAmount",
                totalBooking: "$tpaActiveBookings",
                venues: 1
            }
        }
    ]
    const customerBaseMatch = {
        orgId: matchCondition.orgId,
        ...ValidateQueryFiltersAndInsert({ venueId, sportId, courtId })
    };
    const newClientsPipeline = [
        {
            $match: customerBaseMatch
        },
        {
            $group: {
                _id: "$customerPhone.number",
                firstBookingDate: {
                    $min: "$bookingDate"
                }
            }
        },
        {
            $match: {
                firstBookingDate: matchCondition.bookingDate
            }
        },
        {
            $count: "newCustomers"
        }
    ]
    const upcomingMatch = {
        ...matchCondition,
        bookingDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
    };
    const upcomingBookingPipeline = [
        {
            $match: upcomingMatch
        },

        {
            $lookup: {
                from: "venues",
                localField: "venueId",
                foreignField: "_id",
                as: "venue"
            }
        },
        { $unwind: "$venue" },

        {
            $lookup: {
                from: "sports",
                localField: "sportId",
                foreignField: "_id",
                as: "sport"
            }
        },
        { $unwind: "$sport" },

        {
            $lookup: {
                from: "courts",
                localField: "courtId",
                foreignField: "_id",
                as: "court"
            }
        },
        { $unwind: "$court" },
        { $unwind: "$timeslotId" },
        {
            $lookup: {
                from: "timeslots",
                localField: "timeslotId",
                foreignField: "_id",
                as: "timeslots"
            }
        },
        { $unwind: "$timeslots" },

        {
            $project: {
                venueName: "$venue.name",
                sportName: "$sport.name",
                courtNumber: "$court.courtNumber",
                courtName: "$court.courtName",
                startTime: "$timeslots.startTime",
                endTime: "$timeslots.endTime",
                customerName: 1,
                customerEmail: 1,
                customerPhone: 1,
                status: 1
            }
        },

    ]

    // const result = await Booking.aggregate([
    //     {
    //         $facet: {
    //             revenue: revenuePipeline,
    //             newCustomers: newCustomerPipeline,
    //             upcomingBookings: upcomingPipeline
    //         }
    //     }
    // ]);


    // const totalNewCustomers = result[0].newCustomers[0]?.newCustomers || 0;

    // const data = { totalBookings: result[0].revenue, totalNewCustomers, upcomingBooking: result[0].upcomingBookings }


    const [totalBookings, newCustomers, upcomingBooking] = await Promise.all([
        Booking.aggregate(revenueAndBookingpipeline),
        Booking.aggregate(newClientsPipeline),
        Booking.aggregate(upcomingBookingPipeline)
    ]);

    const totalNewCustomers = newCustomers[0]?.newCustomers || 0;

    const data = { totalBookings, totalNewCustomers, upcomingBooking }
    return response.status(STATUS_CODES.OK).json(createSuccessResponse(STATUS_CODES.OK, data, "data fetched successfully"))
}

module.exports = GetDashboardDataController;
