import { celebrate, Segments, Joi } from "celebrate"


export const registerValidator = () => celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        // profileImage: Joi.string().required(),
        is_verified: Joi.boolean().default(false)
    })
})


export const loginValidator = () => celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
})