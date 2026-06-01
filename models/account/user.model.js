const mongoose = require("mongoose");

const { deleteFromCache } = require("@/utils/connections/redis/redisClient");


function capitalizeWords(str) {
    if (!str) return str;
    return str
        .trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const UserSchema = mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: [true, "First name is required."],
            set: capitalizeWords,
            trim: true
        },
        middleName: {
            type: String,
            required: false,
            set: capitalizeWords,
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "Last name is required."],
            set: capitalizeWords,
            trim: true
        }
    },
    organization: {
        type: String,
        required: false,
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
    },
    email: {
        address: {
            type: String,
            // match: [
            //     /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            //     "Please enter a valid email address."
            // ],
            lowercase: true
        },
        isValid: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    loginEmail: {
        address: {
            type: String,
            // match: [
            //     /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            //     "Please enter a valid email address."
            // ],
            lowercase: true
        },
        isValid: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    parentId: {
        type: String,
        default: "",
        required: false
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    // zoomPassword: {
    //     type: String,
    //     // required: [true, "Zoom password is required."],
    //     // default: CreateZoomPassword()
    // },
    userRoleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRole",
    },
    userStatus: {
        type: String,
        required: [true, "User status is required."],
        enum: ["active", "inactive"],
        default: "active"
    },
    userType: {
        type: String,
        required: [true, "User type is required."],
        enum: ["admin", "employee", "player"]
    },
    userDepartmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserDepartment",
    },
    userBlockStatus: {
        type: String,
        required: [true, "User block status is required."],
        enum: ["yes", "no"],
        default: "no"
    },
    lastLoggedInTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
    userBlockTime: {
        type: Date,
        required: false
    },
    isSuperAdmin: {
        type: String,
        required: [true, "Super Admin status is required."],
        enum: ["yes", "no"],
        default: "no"
    },
    actionIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action"
    }]
}, { timestamps: true });

UserSchema.post("save", async function (document, next) {
    if (this.wasNew) {
        // if (document?.userType != "parent") {
        //     await CreateZoomUserController(document);
        // }
    }
    next();
});

UserSchema.pre("save", async function (next) {
    this.wasNew = this.isNew;
    next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
    this.oldDoc = await this.model.findOne(this.getQuery());
    next();
});

UserSchema.post("findOneAndUpdate", async function (document, next) {
    const oldDocument = this.oldDoc;
    const newDocument = await this.model.findOne(this.getQuery());

    if (oldDocument?.userType != "parent") {
        // await UpdateZoomUserController(oldDocument, newDocument);
    }

    if (
        oldDocument?.name?.firstName != newDocument?.name?.firstName
        || oldDocument?.name?.middleName != newDocument?.name?.middleName
        || oldDocument?.name?.lastName != newDocument?.name?.lastName
        || oldDocument?.email?.address != newDocument?.email?.address
        || oldDocument?.email?.isValid != newDocument?.email?.isValid
        || oldDocument?.loginEmail?.address != newDocument?.loginEmail?.address
        || oldDocument?.loginEmail?.isValid != newDocument?.loginEmail?.isValid
        || oldDocument?.timezone != newDocument?.timezone
        || oldDocument?.userStatus != newDocument?.userStatus
        || oldDocument?.userType != newDocument?.userType
        || oldDocument?.userBlockStatus != newDocument?.userBlockStatus
        || oldDocument?.actionIds.join("") != newDocument?.actionIds?.join("")
    ) {
        const userCacheKey = `edovu:${process.env.NODE_ENV}:${oldDocument?.tenantId || '0001'}:user:${oldDocument?._id.toString()}`;

        if (oldDocument?._id) await deleteFromCache(userCacheKey);
    }

    next();
});

// UserSchema.pre("deleteOne", async function (next) {
//     this.oldDoc = await this.model.findOne(this.getQuery());
//     next();
// });

// UserSchema.post("deleteOne", async function (document, next) {
//     const oldDocument = this.oldDoc;
//     if (oldDocument?.userType != "parent") {
//         // await DeleteZoomUserController(oldDocument?.email?.address);
//     }
//     next();
// });

UserSchema.index({ "email.address": 1 });
UserSchema.index({ "loginEmail.address": 1 });
UserSchema.index({ parentId: 1 });
UserSchema.index({ userType: 1 });
UserSchema.index({ userType: 1, userStatus: 1 });
UserSchema.index({ userBlockStatus: 1 });

module.exports = mongoose.model("User", UserSchema);