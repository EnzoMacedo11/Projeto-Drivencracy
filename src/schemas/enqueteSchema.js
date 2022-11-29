import joi from "joi"

const enqueteschema = joi.object({
    _id: joi.string().min(1).required(),
	title: joi.string().min(1).required(), 
	expireAt: joi.string().min(1).required()
})