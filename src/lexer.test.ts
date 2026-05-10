import { test, expect, describe } from "bun:test";
import { Lexer } from "./lexer";
import { TokenType } from "./token";

function lex(input: string) {
    const lexer = new Lexer(input);
    const tokens = [];
    let token;
    do {
        token = lexer.nextToken();
        tokens.push(token);
    } while (token.type !== TokenType.EOF);
    return tokens;
}

describe("Lexer", () => {
    describe("EOF", () => {
        test("empty input returns EOF", () => {
            const tokens = lex("");
            expect(tokens).toHaveLength(1);
            expect(tokens[0]!.type).toBe(TokenType.EOF);
            expect(tokens[0]!.value).toBe("");
        });

        test("whitespace only returns EOF", () => {
            const tokens = lex("   \n\t\r  ");
            expect(tokens).toHaveLength(1);
            expect(tokens[0]!.type).toBe(TokenType.EOF);
        });
    });

    describe("LEFT_BRACE", () => {
        test("single left brace", () => {
            const tokens = lex("{");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.LEFT_BRACE);
            expect(tokens[0]!.value).toBe("{");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("left brace with surrounding whitespace", () => {
            const tokens = lex("  {  ");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.LEFT_BRACE);
        });
    });

    describe("RIGHT_BRACE", () => {
        test("single right brace", () => {
            const tokens = lex("}");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.RIGHT_BRACE);
            expect(tokens[0]!.value).toBe("}");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("right brace with surrounding whitespace", () => {
            const tokens = lex("\n}");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.RIGHT_BRACE);
        });
    });

    describe("INVALID", () => {
        test("unknown character returns INVALID", () => {
            const tokens = lex("a");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
            expect(tokens[0]!.value).toBe("a");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("string quote returns INVALID", () => {
            const tokens = lex(`"`);
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
        });

        test("colon returns INVALID", () => {
            const tokens = lex(":");
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
        });

        test("comma returns INVALID", () => {
            const tokens = lex(",");
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
        });

        test("number returns INVALID", () => {
            const tokens = lex("42");
            expect(tokens).toHaveLength(3);
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
            expect(tokens[0]!.value).toBe("4");
            expect(tokens[1]!.type).toBe(TokenType.INVALID);
            expect(tokens[1]!.value).toBe("2");
        });
    });

    describe("sequential tokenization", () => {
        test("empty object", () => {
            const tokens = lex("{}");
            expect(tokens).toHaveLength(3);
            expect(tokens[0]!.type).toBe(TokenType.LEFT_BRACE);
            expect(tokens[1]!.type).toBe(TokenType.RIGHT_BRACE);
            expect(tokens[2]!.type).toBe(TokenType.EOF);
        });

        test("empty object with whitespace inside", () => {
            const tokens = lex("{ }");
            expect(tokens).toHaveLength(3);
            expect(tokens[0]!.type).toBe(TokenType.LEFT_BRACE);
            expect(tokens[1]!.type).toBe(TokenType.RIGHT_BRACE);
            expect(tokens[2]!.type).toBe(TokenType.EOF);
        });

        test("nested empty objects", () => {
            const tokens = lex("{{}}");
            expect(tokens).toHaveLength(5);
            expect(tokens.map((t) => t.type)).toEqual([
                TokenType.LEFT_BRACE,
                TokenType.LEFT_BRACE,
                TokenType.RIGHT_BRACE,
                TokenType.RIGHT_BRACE,
                TokenType.EOF,
            ]);
        });

        test("mixed valid and invalid", () => {
            const tokens = lex('{"a"}');
            expect(tokens).toHaveLength(6);
            expect(tokens.map((t) => t.type)).toEqual([
                TokenType.LEFT_BRACE,
                TokenType.INVALID, // "
                TokenType.INVALID, // a
                TokenType.INVALID, // "
                TokenType.RIGHT_BRACE,
                TokenType.EOF,
            ]);
        });
    });
});
