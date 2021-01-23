import { controller, httpPost, requestBody, request, response } from "inversify-express-utils";
import { Request, Response } from "express";
import { BaseController } from "@app/data/utilities/controllers";
import { validate } from "@app/data/utilities/validate";
import { isRuleData } from "./rule-data.validator";
import { RuleDataDTO, RuleData } from "@app/data/ruleData/rule-data";
import { jSendFailure } from "@app/data/utilities/util";
import { conditionalSwitch, extractFields } from "@app/services/rule-data";

type controllerResponse = RuleData | any;

@controller("/validate-rule")
export class RuleDataController extends BaseController<controllerResponse> {
  @httpPost("/", validate(isRuleData))
  async createRuleDataValidation(@request() req: Request, @response() res: Response, @requestBody() body: RuleDataDTO) {
    const { rule, data } = body;

    const { field, fieldProp, notObject } = extractFields(res, rule, data);

    if (!field) {
      return jSendFailure(res, `field ${rule.field} is missing from data.`, 400, null);
    }

    const { details, failure } = conditionalSwitch(res, rule, data, field, fieldProp);

    if (failure || notObject) {
      return jSendFailure(res, `field ${rule.field} failed validation.`, 400, failure || notObject);
    } else {
      return this.jSendSuccess(req, res, `field ${rule.field} successfully validated.`, details);
    }
  }
}
