const modelCache = {};
const mongoose = require("mongoose");

function getTenantModel(tenantCode, modelName, schema) {
    const key = `${modelName}_${tenantCode}`;

    if (!modelCache[key]) {
        modelCache[key] =
            mongoose.models[key] ||
            mongoose.model(key, schema, `${modelName.toLowerCase()}_${tenantCode}`);
    }

    return modelCache[key];
}

module.exports = getTenantModel
