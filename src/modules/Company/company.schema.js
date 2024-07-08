import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";

export const addCompanySchema= {
    body: Joi.object({
        companyName: Joi.string().required(),
        desc:Joi.string().required(),
        industry:Joi.string().required(),
        address:Joi.string().required(),
        noOfEmployees:Joi.number().min(2).max(50).required(),
        companyEmail:generalRules.email
    }),
    headers: Joi.object({
        token: Joi.string().required(),
        ...generalRules.headers,
    }),
}