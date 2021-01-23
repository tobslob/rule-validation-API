import { controller, httpPost, requestBody, request, response } from "inversify-express-utils";
import { Request, Response } from "express";
import { BaseController } from "@app/data/utilities/controllers";
import { validate } from "@app/data/utilities/validate";
import { isRuleDate } from "./rule-data.validator";
import { RuleDataDTO, RuleData, Condition } from "@app/data/ruleData/rule-data";
import { jSendFailure } from "@app/data/utilities/util";
import { dataDetails } from "@app/services/rule-data";

type controllerResponse = RuleData | any

@controller("/validate-rule")
export class RuleDataController extends BaseController<controllerResponse> {
  @httpPost("/", validate(isRuleDate))
  async createRuleDataValidation(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: RuleDataDTO
  ) {

    let field: any, fieldProp: any;
    const { rule, data } = body

    if(rule.field.includes(".")) {
      const splitField = rule.field.split(".")

      field = Object.keys(data).find(keys => keys === splitField[0])

      if(typeof data[field] !== "object") {

        const details = dataDetails(true, rule, data, field)
        return jSendFailure(res, `field ${rule.field} failed validation.`, 400, details)
      } else {
        fieldProp = Object.keys(data[field]).find(keys => keys === splitField[1])
      }
    } else {
      field = Object.keys(data).find(keys => keys === rule.field) 
    }

    if (!field) {
      return jSendFailure(res, `field ${rule.field} is missing from data.`, 400, null)
    }

    if(rule.condition === Condition.Eq) {
      if (rule.field.includes(".") && data[field][fieldProp] == rule.condition_value) {
        const details = dataDetails(false, rule, data, field, fieldProp)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details);
      }
      else if(!rule.field.includes(".") && data[field] == rule.condition_value) {
        const details = dataDetails(false, rule, data, field)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details)
      } else {
        const details = dataDetails(true, rule, data, field, fieldProp)
        return jSendFailure(res, `field ${rule.field} failed validation.`, 400, details)
      }
    }

    if(rule.condition === Condition.Gt) {
      if (rule.field.includes(".") && data[field][fieldProp] > rule.condition_value) {
        const details = dataDetails(false, rule, data, field, fieldProp)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details);
      }
      else if(!rule.field.includes(".") && data[field] > rule.condition_value) {
        const details = dataDetails(false, rule, data, field)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details)
      }
      else {
        const details = dataDetails(true, rule, data, field, fieldProp)
        return jSendFailure(res, `field ${rule.field} failed validation.`, 400, details)
      }
    }

    if(rule.condition === Condition.Gte) {
      if (rule.field.includes(".") && data[field][fieldProp] >= rule.condition_value) {
        const details = dataDetails(false, rule, data, field, fieldProp)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details);
      }
      else if(!rule.field.includes(".") && data[field] >= rule.condition_value) {
        const details = dataDetails(false, rule, data, field)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details)
      }
      else {
        const details = dataDetails(true, rule, data, field, fieldProp)
        return jSendFailure(res, `field ${rule.field} failed validation.`, 400, details)
      }
    }

    if(rule.condition === Condition.Neq) {
      if (rule.field.includes(".") && data[field][fieldProp] !== rule.condition_value) {
        const details = dataDetails(false, rule, data, field, fieldProp)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details);
      }
      else if(!rule.field.includes(".") && data[field] !== rule.condition_value) {
        const details = dataDetails(false, rule, data, field)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details)
      }
      else {
        const details = dataDetails(true, rule, data, field, fieldProp)
        return jSendFailure(res, `field ${rule.field} failed validation.`, 400, details)
      }
    }

    if(rule.condition === Condition.Contains) {
      if (rule.field.includes(".") && (typeof data[field][fieldProp] === "object") && data[field][fieldProp].includes(rule.condition_value)) {
        const details = dataDetails(false, rule, data, field, fieldProp)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details);
      }
      else if(!rule.field.includes(".") && (typeof data[field] === "object") && data[field].includes(rule.condition_value)) {
        const details = dataDetails(false, rule, data, field)
        return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details)
      }
      else {
        const details = dataDetails(true, rule, data, field, fieldProp)
        return jSendFailure(res, `field ${rule.field} failed validation.`, 400, details)
      }
    }
    const details = dataDetails(true, rule, data, field, fieldProp)
    return jSendFailure(res, `field ${rule.field} failed validation.`, 400, details)
  }
}
