const Joi = require("joi");
const objectId = require("./objectIdValidator");

module.exports = (req, res, next) => {
  try {
    const schema = Joi.object({
      id: objectId("id").required(),
    });

    const { error } = schema.validate(req?.params);
    if (error) {
      return res.status(409).json({
        code: 409,
        success: false,
        error: [
          {
            field: "popup",
            message: error.details[0].message,
          },
        ],
        message: "",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      error: [{ field: "popup", message: `Error: ${error}` }],
      message: "",
    });
  }
};
