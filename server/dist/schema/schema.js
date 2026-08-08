import Joi from "joi";
const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
        .email({
        minDomainSegments: 2,
        tlds: {
            allow: ["com", "net"],
        },
    })
        .required(),
    password: Joi.string()
        .min(6)
        .max(30)
        .pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required(),
});
export default schema;
//# sourceMappingURL=schema.js.map