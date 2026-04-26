export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface IParser {
  parse(input: string): number[];
  validate(input: string): ValidationResult;
}
