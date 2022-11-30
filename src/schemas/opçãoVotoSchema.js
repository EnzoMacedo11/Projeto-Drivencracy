import joi from "joi"

const opçãoschema = joi.object({
    //_id: joi.string().min(1).required(),
	title: joi.string().min(1).required(), 
	pollId: joi.string().min(1).required()
})

export default opçãoschema