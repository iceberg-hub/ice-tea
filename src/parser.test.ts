import { test, expect, describe } from "bun:test";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

function parseValue(input: string) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    return parser.parse();
}

function expectInvalid(input: string): void {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    expect(() => parser.parse()).toThrow(SyntaxError);
}

describe("Parser", () => {
    describe("valid JSON", () => {
        test("empty object {}", () => {
            expect(parseValue("{}")).toEqual({});
        });

        test("object with whitespace", () => {
            expect(parseValue("{ }")).toEqual({});
            expect(parseValue("  {}  ")).toEqual({});
            expect(parseValue("\n{\n}\n")).toEqual({});
        });

        test("object with string value", () => {
            expect(parseValue('{"key": "value"}')).toEqual({ key: "value" });
        });

        test("object with number value", () => {
            expect(parseValue('{"n": 42}')).toEqual({ n: 42 });
        });

        test("object with negative number value", () => {
            expect(parseValue('{"n": -7}')).toEqual({ n: -7 });
        });

        test("object with boolean values", () => {
            expect(parseValue('{"a": true, "b": false}')).toEqual({
                a: true,
                b: false,
            });
        });

        test("object with null value", () => {
            expect(parseValue('{"x": null}')).toEqual({ x: null });
        });

        test("object with multiple keys", () => {
            expect(parseValue('{"k1": "v1", "k2": "v2"}')).toEqual({
                k1: "v1",
                k2: "v2",
            });
        });

        test("empty array []", () => {
            expect(parseValue("[]")).toEqual([]);
        });

        test("array with values", () => {
            expect(parseValue('[1, "a", true, false, null]')).toEqual([
                1,
                "a",
                true,
                false,
                null,
            ]);
        });

        test("nested objects", () => {
            expect(parseValue('{"a": {"b": "c"}}')).toEqual({
                a: { b: "c" },
            });
        });

        test("nested arrays", () => {
            expect(parseValue("[[1, 2], [3, 4]]")).toEqual([[1, 2], [3, 4]]);
        });

        test("object with nested array", () => {
            expect(parseValue('{"list": [1, 2, 3]}')).toEqual({
                list: [1, 2, 3],
            });
        });

        test("array with nested objects", () => {
            expect(parseValue('[{"a": 1}, {"b": 2}]')).toEqual([
                { a: 1 },
                { b: 2 },
            ]);
        });

        test("string value", () => {
            expect(parseValue('"hello"')).toBe("hello");
        });

        test("number value", () => {
            expect(parseValue("42")).toBe(42);
            expect(parseValue("-1")).toBe(-1);
            expect(parseValue("0")).toBe(0);
        });

        test("boolean true", () => {
            expect(parseValue("true")).toBe(true);
        });

        test("boolean false", () => {
            expect(parseValue("false")).toBe(false);
        });

        test("null value", () => {
            expect(parseValue("null")).toBe(null);
        });
    });

    describe("invalid JSON", () => {
        test("empty input", () => {
            expectInvalid("");
        });

        test("whitespace only", () => {
            expectInvalid("   ");
            expectInvalid("\n\t\n");
        });

        test("missing closing brace", () => {
            expectInvalid("{");
        });

        test("lone right brace", () => {
            expectInvalid("}");
        });

        test("multiple top-level objects", () => {
            expectInvalid("{}{}");
        });

        test("invalid keyword", () => {
            expectInvalid("True");
            expectInvalid("tru");
        });

        test("invalid content in object", () => {
            expectInvalid("{a}");
            expectInvalid("{{}}");
        });

        test("unclosed string in object value", () => {
            expectInvalid('{"key": "val');
        });

        test("unexpected token after valid value", () => {
            expectInvalid('{} extra');
        });

        test("trailing comma in object", () => {
            expectInvalid('{"a": 1,}');
        });

        test("missing comma in object", () => {
            expectInvalid('{"a": 1 "b": 2}');
        });

        test("missing colon", () => {
            expectInvalid('{"a" "b"}');
        });

        test("trailing comma in array", () => {
            expectInvalid("[1,]");
        });

        test("missing value in array", () => {
            expectInvalid("[,]");
        });

        test("mismatched brackets", () => {
            expectInvalid('["mismatch"}');
        });
    });
});
