import {verifyJwToken, refreshJwToken}  from "./authJwt";
import Joi from 'joi';

const validateStaff = (req,res,next) =>
{
    const JoiSchema = Joi.object({
      
        engineer_name: Joi.string().required(),                    
        email: Joi.string() .email().optional(),
        phone_number: Joi.string().optional(),
        designation: Joi.string().optional()

    }).options({ abortEarly: false });
    
    let response = JoiSchema.validate(req.body);
    if(response.error)
    {  
        return res.status(403).send({ message: returnErrorMessage(response.error.details) });
    }
    next();
}

const validateProject = (req,res,next) =>
{
    const JoiSchema = Joi.object({
        project_name : Joi.string().required(),
        project_head : Joi.string().required(),
        category : Joi.string().required(),
        location : Joi.string().required(),
        start_date : Joi.date().required(),
        due_date : Joi.date().required(),
        design : Joi.string().allow(''),
        blue_print : Joi.string().allow(''),
        status : Joi.string().optional(),
        description : Joi.string().optional()
    }).options({ abortEarly: false });
  
    let response = JoiSchema.validate(req.body);
    if(response.error)
    {  
        return res.status(403).send({ message: returnErrorMessage(response.error.details) });
    }
    next();
}

function returnErrorMessage(response){
    let errorMessages = []
    response.forEach(element => {
        errorMessages.push(element.message);
    });    
    return errorMessages;
}

export {
    validateProject,
    validateStaff,
    verifyJwToken,
    refreshJwToken
};