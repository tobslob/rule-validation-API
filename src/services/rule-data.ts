import { isRuleDTO, Condition } from "@app/data/ruleData/rule-data";
import { Response } from "express";
import { jSendFailure } from "@app/data/utilities/util";

export const dataDetails = (bool: boolean, rule: isRuleDTO, data: any, field: string, fieldProp?: string) => {
  return {
    validation: {
      error: bool,
      field: rule.field,
      field_value: fieldProp ? data[field][fieldProp] : data[field],
      condition: rule.condition,
      condition_value: rule.condition_value
    }
  };
};

export const extractFields = (res: Response, rule: isRuleDTO, data: any) => {
  let field, fieldProp, notObject;

  if (rule.field.includes(".")) {
    fieldProp;
    const splitField = rule.field.split(".");
    field = Object.keys(data).find(keys => keys === splitField[0]);

    if (typeof data[field] !== "object") {
      const details = dataDetails(true, rule, data, field);
      notObject = jSendFailure(res, `field ${rule.field} failed validation.`, 400, details);
    } else {
      fieldProp = Object.keys(data[field]).find(keys => keys === splitField[1]);
    }
  } else {
    field = Object.keys(data).find(keys => keys === rule.field);
  }
  return { field, fieldProp, notObject}
};

export const conditionalSwitch = (_res: Response, rule: isRuleDTO, data: any, field: string, fieldProp: string) => {
  let details, failure;
  switch (rule.condition) {
    case Condition.Eq: {
      if (rule.field.includes(".") && data[field][fieldProp] == rule.condition_value) {
        details = dataDetails(false, rule, data, field, fieldProp);
      } else if (!rule.field.includes(".") && data[field] == rule.condition_value) {
        details = dataDetails(false, rule, data, field);
        return details;
      } else {
        failure = dataDetails(true, rule, data, field, fieldProp);
      }
      break;
    }

    case Condition.Gt: {
      if (rule.field.includes(".") && data[field][fieldProp] > rule.condition_value) {
        details = dataDetails(false, rule, data, field, fieldProp);
      } else if (!rule.field.includes(".") && data[field] > rule.condition_value) {
        details = dataDetails(false, rule, data, field);
      } else {
        failure = dataDetails(true, rule, data, field, fieldProp);
      }
      break;
    }

    case Condition.Gte: {
      if (rule.field.includes(".") && data[field][fieldProp] >= rule.condition_value) {
        details = dataDetails(false, rule, data, field, fieldProp);
      } else if (!rule.field.includes(".") && data[field] >= rule.condition_value) {
        details = dataDetails(false, rule, data, field);
      } else {
        failure = dataDetails(true, rule, data, field, fieldProp);
      }
      break;
    }

    case Condition.Neq: {
      if (rule.field.includes(".") && data[field][fieldProp] !== rule.condition_value) {
        details = dataDetails(false, rule, data, field, fieldProp);
      } else if (!rule.field.includes(".") && data[field] !== rule.condition_value) {
        details = dataDetails(false, rule, data, field);
      } else {
        failure = dataDetails(true, rule, data, field, fieldProp);
      }
      break;
    }

    case Condition.Contains: {
      if (
        rule.field.includes(".") &&
        typeof data[field][fieldProp] === "object" &&
        data[field][fieldProp].includes(rule.condition_value)
      ) {
        details = dataDetails(false, rule, data, field, fieldProp);
      } else if (
        !rule.field.includes(".") &&
        typeof data[field] === "object" &&
        data[field].includes(rule.condition_value)
      ) {
        details = dataDetails(false, rule, data, field);
      } else {
        failure = dataDetails(true, rule, data, field, fieldProp);
      }
      break;
    }

    default: {
      failure = dataDetails(true, rule, data, field, fieldProp);
    }
  }

  return { details, failure };
};
