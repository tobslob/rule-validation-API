import { controller, httpPost, requestBody, request, response } from "inversify-express-utils";
import { Request, Response } from "express";
import { BaseController } from "@app/data/utilities/controllers";
import { validate } from "@app/data/utilities/validate";
import { isRuleData } from "./rule-data.validator";
import { RuleDataDTO, RuleData } from "@app/data/ruleData/rule-data";
import { jSendFailure } from "@app/data/utilities/util";
import { dataDetails, conditionalSwitch } from "@app/services/rule-data";

type controllerResponse = RuleData | any;

@controller("/validate-rule")
export class RuleDataController extends BaseController<controllerResponse> {
  @httpPost("/", validate(isRuleData))
  async createRuleDataValidation(@request() req: Request, @response() res: Response, @requestBody() body: RuleDataDTO) {
    let field: any, fieldProp: any;
    const { rule, data } = body;

    if (rule.field.includes(".")) {
      const splitField = rule.field.split(".");
      field = Object.keys(data).find(keys => keys === splitField[0]);

      if (typeof data[field] !== "object") {
        const details = dataDetails(true, rule, data, field);
        return jSendFailure(res, `field ${rule.field} failed validation.`, 400, details);
      } else {
        fieldProp = Object.keys(data[field]).find(keys => keys === splitField[1]);
      }
    } else {
      field = Object.keys(data).find(keys => keys === rule.field);
    }

    if (!field) {
      return jSendFailure(res, `field ${rule.field} is missing from data.`, 400, null);
    }

    const { details, failure } = conditionalSwitch(res, rule, data, field, fieldProp);

    if (failure) {
      return jSendFailure(res, `field ${rule.field} failed validation.`, 400, failure);
    } else {
      return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details);
    }
  }
}
