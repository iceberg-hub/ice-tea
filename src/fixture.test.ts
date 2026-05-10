import { test, expect, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

function expectParse(input: string) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    expect(() => parser.parse()).not.toThrow();
}

function expectParseError(input: string) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    expect(() => parser.parse()).toThrow(SyntaxError);
}

describe("fixture", () => {
    describe("pass fixtures", () => {
        test("pass2.json (deeply nested array)", () => {
            expectParse(readFileSync("fixture/pass2.json", "utf-8"));
        });

        test("pass3.json (nested object)", () => {
            expectParse(readFileSync("fixture/pass3.json", "utf-8"));
        });

        test.todo(
            "pass1.json (full JSON test - parser does not yet support decimals or escape sequences)",
        );
    });

    describe("fail fixtures that correctly throw", () => {
        test("fail2.json (unclosed array)", () => {
            expectParseError(readFileSync("fixture/fail2.json", "utf-8"));
        });

        test("fail3.json (unquoted key)", () => {
            expectParseError(readFileSync("fixture/fail3.json", "utf-8"));
        });

        test("fail4.json (extra comma in array)", () => {
            expectParseError(readFileSync("fixture/fail4.json", "utf-8"));
        });

        test("fail5.json (double extra comma)", () => {
            expectParseError(readFileSync("fixture/fail5.json", "utf-8"));
        });

        test("fail6.json (missing value)", () => {
            expectParseError(readFileSync("fixture/fail6.json", "utf-8"));
        });

        test("fail7.json (comma after close)", () => {
            expectParseError(readFileSync("fixture/fail7.json", "utf-8"));
        });

        test("fail8.json (extra close bracket)", () => {
            expectParseError(readFileSync("fixture/fail8.json", "utf-8"));
        });

        test("fail9.json (extra comma in object)", () => {
            expectParseError(readFileSync("fixture/fail9.json", "utf-8"));
        });

        test("fail10.json (extra value after close)", () => {
            expectParseError(readFileSync("fixture/fail10.json", "utf-8"));
        });

        test("fail11.json (illegal expression)", () => {
            expectParseError(readFileSync("fixture/fail11.json", "utf-8"));
        });

        test("fail12.json (illegal invocation)", () => {
            expectParseError(readFileSync("fixture/fail12.json", "utf-8"));
        });

        test("fail14.json (hex number)", () => {
            expectParseError(readFileSync("fixture/fail14.json", "utf-8"));
        });

        test("fail16.json (naked value)", () => {
            expectParseError(readFileSync("fixture/fail16.json", "utf-8"));
        });

        test("fail19.json (missing colon)", () => {
            expectParseError(readFileSync("fixture/fail19.json", "utf-8"));
        });

        test("fail20.json (double colon)", () => {
            expectParseError(readFileSync("fixture/fail20.json", "utf-8"));
        });

        test("fail21.json (comma instead of colon)", () => {
            expectParseError(readFileSync("fixture/fail21.json", "utf-8"));
        });

        test("fail22.json (colon instead of comma)", () => {
            expectParseError(readFileSync("fixture/fail22.json", "utf-8"));
        });

        test("fail23.json (bad value)", () => {
            expectParseError(readFileSync("fixture/fail23.json", "utf-8"));
        });

        test("fail24.json (single quotes)", () => {
            expectParseError(readFileSync("fixture/fail24.json", "utf-8"));
        });

        test("fail29.json (incomplete exponent)", () => {
            expectParseError(readFileSync("fixture/fail29.json", "utf-8"));
        });

        test("fail30.json (incomplete exponent with sign)", () => {
            expectParseError(readFileSync("fixture/fail30.json", "utf-8"));
        });

        test("fail31.json (invalid exponent)", () => {
            expectParseError(readFileSync("fixture/fail31.json", "utf-8"));
        });

        test("fail32.json (missing closing brace)", () => {
            expectParseError(readFileSync("fixture/fail32.json", "utf-8"));
        });

        test("fail33.json (mismatched brackets)", () => {
            expectParseError(readFileSync("fixture/fail33.json", "utf-8"));
        });
    });

    describe("fail fixtures that are known limitations", () => {
        test.todo(
            "fail1.json (top-level string - parser allows any top-level value which matches RFC 8259)",
        );

        test.todo(
            "fail13.json (leading zeros - parser does not validate number format)",
        );

        test.todo(
            "fail15.json (illegal escape - parser does not validate string escapes)",
        );

        test.todo(
            "fail17.json (illegal octal escape - parser does not validate string escapes)",
        );

        test.todo(
            "fail18.json (too deep - parser has no depth limit)",
        );

        test.todo(
            "fail25.json (tab in string - parser does not validate string content)",
        );

        test.todo(
            "fail26.json (backslash in string - parser does not validate string escapes)",
        );

        test.todo(
            "fail27.json (line break in string - parser allows multi-line strings)",
        );

        test.todo(
            "fail28.json (escaped line break - parser does not validate string escapes)",
        );
    });
});
