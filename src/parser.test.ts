import { test, expect, describe } from "bun:test";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

function parse(input: string): boolean {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    return parser.parse();
}

describe("Parser", () => {
    test("empty object {} is valid", () => {
        expect(parse("{}")).toBe(true);
    });

    test("empty object with whitespace is valid", () => {
        expect(parse("{ }")).toBe(true);
        expect(parse("  {}  ")).toBe(true);
        expect(parse("\n{\n}\n")).toBe(true);
    });

    test("empty input is invalid", () => {
        expect(parse("")).toBe(false);
    });

    test("only whitespace is invalid", () => {
        expect(parse("   ")).toBe(false);
    });

    test("missing closing brace is invalid", () => {
        expect(parse("{")).toBe(false);
    });

    test("missing opening brace is invalid", () => {
        expect(parse("}")).toBe(false);
    });

    test("only left brace is invalid", () => {
        expect(parse("{")).toBe(false);
    });

    test("only right brace is invalid", () => {
        expect(parse("}")).toBe(false);
    });

    test("content inside braces is invalid (step1 only)", () => {
        expect(parse('{"key": "value"}')).toBe(false);
    });

    test("nested objects are invalid (step1 only)", () => {
        expect(parse("{{}}")).toBe(false);
    });

    test("multiple top-level tokens are invalid", () => {
        expect(parse("{}{}")).toBe(false);
    });

    test("invalid tokens inside braces are invalid", () => {
        expect(parse("{a}")).toBe(false);
    });
});
