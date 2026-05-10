import type { JSONValue, JSONObject, JSONArray } from "./json";
import type { Lexer } from "./lexer";
import { TokenType, type Token, type TokenKey } from "./token";

export class Parser {
    private current: Token;

    constructor(private readonly lexer: Lexer) {
        this.current = this.lexer.nextToken();
    }

    parse(): JSONValue {
        const value = this.parseValue();

        if (this.current.type !== TokenType.EOF) {
            throw new SyntaxError("Unexpected token after JSON");
        }

        return value;
    }

    private parseObject(): JSONObject {
        this.expect(TokenType.LEFT_BRACE);

        const object: JSONObject = {};

        if (this.current.type === TokenType.RIGHT_BRACE) {
            this.advance();
            return object;
        }

        while (true) {
            const [key, value] = this.parsePair();

            object[key] = value;

            if (this.current.type === TokenType.COMMA) {
                this.advance();
                continue;
            }

            break;
        }

        this.expect(TokenType.RIGHT_BRACE);

        return object;
    }

    private parsePair(): [string, JSONValue] {
        const key = this.current.value;

        this.expect(TokenType.STRING);
        this.expect(TokenType.COLON);

        const value = this.parseValue();

        return [key, value];
    }

    private parseArray(): JSONArray {
        this.expect(TokenType.LEFT_BRACKET);

        const array: JSONArray = [];

        if (this.current.type === TokenType.RIGHT_BRACKET) {
            this.advance();
            return array;
        }

        array.push(this.parseValue());

        while (this.current.type === TokenType.COMMA) {
            this.advance();

            array.push(this.parseValue());
        }

        this.expect(TokenType.RIGHT_BRACKET);

        return array;
    }

    private parseValue(): JSONValue {
        switch (this.current.type) {
            case TokenType.STRING: {
                const value = this.current.value;
                this.advance();
                return value;
            }
            case TokenType.NUMBER: {
                const value = Number(this.current.value);
                this.advance();
                return value;
            }
            case TokenType.TRUE:
                this.advance();
                return true;
            case TokenType.FALSE:
                this.advance();
                return false;
            case TokenType.NULL:
                this.advance();
                return null;
            case TokenType.LEFT_BRACE:
                return this.parseObject();
            case TokenType.LEFT_BRACKET:
                return this.parseArray();
            default:
                throw new SyntaxError(
                    `Unexpected token: ${this.current.type}`
                );
        }
    }

    private expect(type: TokenKey) {
        if (this.current.type !== type) {
            throw new SyntaxError(
                `Expected ${type}, got ${this.current.type}`
            );
        }

        this.advance();
    }

    private advance() {
        this.current = this.lexer.nextToken();
    }
}