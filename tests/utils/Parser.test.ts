import { Parser } from "../../src/utils/Parser";
import { IParser } from "../../src/interfaces/IParser";

describe("Parser", () => {
  let parser: IParser;

  beforeEach(() => {
    parser = new Parser();
  });

  describe("parse", () => {
    it("should parse space-separated numbers", () => {
      const result = parser.parse("1 2 3 4 5");

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should parse newline-separated numbers", () => {
      const result = parser.parse("1\n2\n3\n4\n5");

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should parse mixed whitespace-separated numbers", () => {
      const result = parser.parse("1 2\n3\t4  5");

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should parse negative numbers", () => {
      const result = parser.parse("-5 -10 3");

      expect(result).toEqual([-5, -10, 3]);
    });

    it("should parse zero", () => {
      const result = parser.parse("0 1 0 2 0");

      expect(result).toEqual([0, 1, 0, 2, 0]);
    });

    it("should handle leading and trailing whitespace", () => {
      const result = parser.parse("  1 2 3  ");

      expect(result).toEqual([1, 2, 3]);
    });

    it("should handle multiple consecutive spaces", () => {
      const result = parser.parse("1    2    3");

      expect(result).toEqual([1, 2, 3]);
    });

    it("should parse a simple program", () => {
      const result = parser.parse("7 10 20 9");

      expect(result).toEqual([7, 10, 20, 9]);
    });

    it("should throw error for empty input", () => {
      expect(() => parser.parse("")).toThrow("Program cannot be empty");
    });

    it("should throw error for whitespace-only input", () => {
      expect(() => parser.parse("   \n  \t  ")).toThrow(
        "Program cannot be empty",
      );
    });

    it("should throw error for invalid tokens", () => {
      expect(() => parser.parse("1 abc 3")).toThrow(
        'Invalid token at position 2: "abc"',
      );
    });

    it("should throw error for decimal numbers", () => {
      expect(() => parser.parse("1 2.5 3")).toThrow(
        'Invalid token at position 2: "2.5"',
      );
    });

    it("should throw error for special characters", () => {
      expect(() => parser.parse("1 @ 3")).toThrow(
        'Invalid token at position 2: "@"',
      );
    });
  });

  describe("validate", () => {
    it("should return valid for correct input", () => {
      const result = parser.validate("1 2 3 4 5");

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should return valid for negative numbers", () => {
      const result = parser.validate("-1 -2 3");

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should return invalid for empty input", () => {
      const result = parser.validate("");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Program cannot be empty");
    });

    it("should return invalid for whitespace-only input", () => {
      const result = parser.validate("   \n  ");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Program cannot be empty");
    });

    it("should return invalid for non-numeric tokens", () => {
      const result = parser.validate("1 hello 3");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid token at position 2: "hello"');
    });

    it("should return invalid for decimal numbers", () => {
      const result = parser.validate("1 2.5 3");

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid token at position 2: "2.5"');
    });

    it("should return multiple errors for multiple invalid tokens", () => {
      const result = parser.validate("1 abc 3 def 5");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBe(2);
      expect(result.errors).toContain('Invalid token at position 2: "abc"');
      expect(result.errors).toContain('Invalid token at position 4: "def"');
    });

    it("should accept large safe integers", () => {
      const result = parser.validate("999999999 -999999999");

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});
