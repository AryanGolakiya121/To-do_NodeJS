import { celebrate, Segments, Joi } from "celebrate"


export const registerValidator = () => celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        // profileImage: Joi.string().required(),
    })
})


// export const registerValidator = () => (req, res, next) => {
//     const schema = Joi.object({
//         email: Joi.string().email().required(),
//         password: Joi.string().required(),
//     })

//     const { error } = schema.validate(req.body)

//     if(error){
//         return res.status(400).json({status: false, message: error.details[0].message})
//     }
//     if(!req.file){
//         return res.status(400).json({status: false, message: "Profile image is required"})
//     }
//     next();
// }


export const loginValidator = () => celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
})