export enum Condition {
    Eq = 'eq',
    Neq = 'neq',
    Gt = 'gt',
    Gte = 'gte',
    Contains = 'contains',
}

export interface isRule {
  field: string,
  condition: Condition,
  condition_value: any,
}

export interface RuleData {
  rule: isRule,
  data: any,
}

export interface isRuleDTO {
  field: string,
  condition: Condition,
  condition_value: any,
}

export interface RuleDataDTO {
  rule: isRuleDTO,
  data: any,
}
