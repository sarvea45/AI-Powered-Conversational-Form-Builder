const Ajv = require("ajv");

const ajv = new Ajv({ strict: false, validateSchema: true });


function validateSchema(schema) {
    const isValid = ajv.validateSchema(schema);
    if (!isValid) {
        return {
            isValid: false,
            errors: ajv.errorsText(ajv.errors)
        };
    }
    return { isValid: true };
}

module.exports = { validateSchema };
