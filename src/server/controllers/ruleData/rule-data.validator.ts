import Joi, { any } from "@hapi/joi";
import { JoiValidator } from "@app/data/utilities/validate";
import { Condition } from "@app/data/ruleData/rule-data";
import _ from "lodash";

const isRule = Joi.object({
  field: JoiValidator.requiredString(),
  condition: JoiValidator.requiredString().valid(_.values(Condition)),
  condition_value: Joi.any().required()
});

export const isRuleDate = Joi.object({
  rule: isRule,
  data: any().required()
});
