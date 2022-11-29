import joi from "joi"

const votoschema = joi.object({
    _id: joi.string().min(1).required(),
	createdAt: joi.string().min(1).required(), 
	choiceId: joi.string().min(1).required(), 

})