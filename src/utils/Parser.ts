import { IParser, ValidationResult } from "../interfaces/IParser";

export class Parser implements IParser {
  parse(input: string): number[] {
    const validation = this.validate(input);
    
    if (!validation.valid) {
      throw new Error(
        `Failed to parse program: ${validation.errors.join(", ")}`,
      );
    }

    return input
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0)
      .map((token) => parseInt(token, 10));
  }

  validate(input: string): ValidationResult {
    const errors: string[] = [];

    // Check for empty input
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      errors.push("Program cannot be empty");
      return { valid: false, errors };
    }

    // Split by whitespace and validate each token
    const tokens = trimmed.split(/\s+/).filter((token) => token.length > 0);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Check if token is a valid integer
      if (!/^-?\d+$/.test(token)) {
        errors.push(`Invalid token at position ${i + 1}: "${token}"`);
        continue;
      }

      // Parse and check if it's within safe integer range
      const num = parseInt(token, 10);
      if (!Number.isSafeInteger(num)) {
        errors.push(
          `Number at position ${i + 1} exceeds safe integer range: ${token}`,
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
