import Joi, { SchemaLike,} from "@hapi/joi";
import { jSendError } from "./util";
import { Request, Response, NextFunction, RequestHandler} from "express";

export function validate(schema: SchemaLike): RequestHandler{
  return (req: Request, res: Response, next: NextFunction) => {
  if (!schema) return next();

  const { body, params, query } = req;

  Joi.validate({ ...body, ...params, ...query }, schema, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true
  })
    .then(() => next())
    .catch(err => {
      let errors = {};
      err.details.forEach(e => {
        errors[e.message.split(" ", 1)[0].replace(/['"]/g, "")] = e.message.replace(/['"]/g, "");
      });
      errors = Object.values(errors).toString()
      return jSendError(res, `${errors}.`, 400, null)
    });
  }
};

/** *
 *  Object that help to validate user details
 */
export const JoiValidator = {
  isString() {
    return Joi.string();
  },

  requiredString() {
    return Joi.string().required();
  },

  isNumber() {
    return Joi.number().required();
  },
};
