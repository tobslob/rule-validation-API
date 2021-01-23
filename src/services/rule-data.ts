import { isRuleDTO } from "@app/data/ruleData/rule-data"

export const dataDetails = (bool: boolean, rule: isRuleDTO, data: any, field: string, fieldProp?: string) => {
  return {
    validation: {
      error: bool,
      field: rule.field,
      field_value: fieldProp ? data[field][fieldProp] : data[field],
      condition: rule.condition,
      condition_value: rule.condition_value
    }
  }
}
