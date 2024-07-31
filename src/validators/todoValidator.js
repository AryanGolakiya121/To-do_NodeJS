import { celebrate, Segments, Joi } from "celebrate";
import { todoStatus } from "../helper/enum.js";

export const todoValidator = () => celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        status: Joi.string().valid(todoStatus.PENDING, todoStatus.INPROGRESS, todoStatus.COMPLETE, todoStatus.CANCEL).default(todoStatus.PENDING) 
    })
})

export const editTodoValidator = () => celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        status: Joi.string().valid(todoStatus.PENDING, todoStatus.INPROGRESS, todoStatus.COMPLETE, todoStatus.CANCEL).default(todoStatus.PENDING) 
    })
})

export const updateTodoStatusValidator = () => celebrate({
    [Segments.BODY]: Joi.object().keys({
        status: Joi.string().valid(todoStatus.PENDING, todoStatus.INPROGRESS, todoStatus.COMPLETE, todoStatus.CANCEL).required(),
    })
})