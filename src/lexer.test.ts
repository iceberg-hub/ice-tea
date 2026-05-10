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

    describe("LEFT_BRACKET", () => {
        test("single left bracket", () => {
            const tokens = lex("[");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.LEFT_BRACKET);
            expect(tokens[0]!.value).toBe("[");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("left bracket with surrounding whitespace", () => {
            const tokens = lex("  [  ");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.LEFT_BRACKET);
        });
    });

    describe("RIGHT_BRACKET", () => {
        test("single right bracket", () => {
            const tokens = lex("]");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.RIGHT_BRACKET);
            expect(tokens[0]!.value).toBe("]");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("right bracket with surrounding whitespace", () => {
            const tokens = lex("\n]");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.RIGHT_BRACKET);
        });
    });

    describe("COLON", () => {
        test("single colon", () => {
            const tokens = lex(":");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.COLON);
            expect(tokens[0]!.value).toBe(":");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("colon with surrounding whitespace", () => {
            const tokens = lex("  :  ");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.COLON);
        });
    });

    describe("COMMA", () => {
        test("single comma", () => {
            const tokens = lex(",");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.COMMA);
            expect(tokens[0]!.value).toBe(",");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("comma with surrounding whitespace", () => {
            const tokens = lex("  ,  ");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.COMMA);
        });
    });

    describe("STRING", () => {
        test("simple string", () => {
            const tokens = lex('"hello"');
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.STRING);
            expect(tokens[0]!.value).toBe("hello");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("empty string", () => {
            const tokens = lex('""');
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.STRING);
            expect(tokens[0]!.value).toBe("");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("string with spaces", () => {
            const tokens = lex('"hello world"');
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.STRING);
            expect(tokens[0]!.value).toBe("hello world");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("unclosed string returns INVALID", () => {
            const tokens = lex('"unclosed');
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
            expect(tokens[0]!.value).toBe("unclosed");
        });
    });

    describe("NUMBER", () => {
        test("single digit", () => {
            const tokens = lex("0");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.NUMBER);
            expect(tokens[0]!.value).toBe("0");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("multi-digit number", () => {
            const tokens = lex("42");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.NUMBER);
            expect(tokens[0]!.value).toBe("42");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("negative number", () => {
            const tokens = lex("-42");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.NUMBER);
            expect(tokens[0]!.value).toBe("-42");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("number with surrounding whitespace", () => {
            const tokens = lex("  123  ");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.NUMBER);
            expect(tokens[0]!.value).toBe("123");
        });
    });

    describe("keywords", () => {
        test("true", () => {
            const tokens = lex("true");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.TRUE);
            expect(tokens[0]!.value).toBe("true");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("false", () => {
            const tokens = lex("false");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.FALSE);
            expect(tokens[0]!.value).toBe("false");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("null", () => {
            const tokens = lex("null");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.NULL);
            expect(tokens[0]!.value).toBe("null");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });
    });

    describe("INVALID", () => {
        test("unknown character returns INVALID", () => {
            const tokens = lex("@");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
            expect(tokens[0]!.value).toBe("@");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("invalid keyword returns INVALID", () => {
            const tokens = lex("tru");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
            expect(tokens[0]!.value).toBe("tru");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
        });

        test("capitalized keyword returns INVALID", () => {
            const tokens = lex("True");
            expect(tokens).toHaveLength(2);
            expect(tokens[0]!.type).toBe(TokenType.INVALID);
            expect(tokens[0]!.value).toBe("True");
            expect(tokens[1]!.type).toBe(TokenType.EOF);
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

        test("empty array", () => {
            const tokens = lex("[]");
            expect(tokens).toHaveLength(3);
            expect(tokens[0]!.type).toBe(TokenType.LEFT_BRACKET);
            expect(tokens[1]!.type).toBe(TokenType.RIGHT_BRACKET);
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

        test("object with string key and value", () => {
            const tokens = lex('{"key":"value"}');
            expect(tokens.map((t) => t.type)).toEqual([
                TokenType.LEFT_BRACE,
                TokenType.STRING,
                TokenType.COLON,
                TokenType.STRING,
                TokenType.RIGHT_BRACE,
                TokenType.EOF,
            ]);
            expect(tokens[1]!.value).toBe("key");
            expect(tokens[3]!.value).toBe("value");
        });

        test("object with multiple pairs", () => {
            const tokens = lex('{"a":1,"b":2}');
            expect(tokens.map((t) => t.type)).toEqual([
                TokenType.LEFT_BRACE,
                TokenType.STRING,
                TokenType.COLON,
                TokenType.NUMBER,
                TokenType.COMMA,
                TokenType.STRING,
                TokenType.COLON,
                TokenType.NUMBER,
                TokenType.RIGHT_BRACE,
                TokenType.EOF,
            ]);
        });

        test("array with mixed values", () => {
            const tokens = lex('[1,"a",true,false,null]');
            expect(tokens.map((t) => t.type)).toEqual([
                TokenType.LEFT_BRACKET,
                TokenType.NUMBER,
                TokenType.COMMA,
                TokenType.STRING,
                TokenType.COMMA,
                TokenType.TRUE,
                TokenType.COMMA,
                TokenType.FALSE,
                TokenType.COMMA,
                TokenType.NULL,
                TokenType.RIGHT_BRACKET,
                TokenType.EOF,
            ]);
        });

        test("nested arrays", () => {
            const tokens = lex("[[[]]]");
            expect(tokens.map((t) => t.type)).toEqual([
                TokenType.LEFT_BRACKET,
                TokenType.LEFT_BRACKET,
                TokenType.LEFT_BRACKET,
                TokenType.RIGHT_BRACKET,
                TokenType.RIGHT_BRACKET,
                TokenType.RIGHT_BRACKET,
                TokenType.EOF,
            ]);
        });
    });
});
