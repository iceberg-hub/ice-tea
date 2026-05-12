import type { JSONValue, JSONObject, JSONArray } from "./json";
import type { Lexer } from "./lexer";
import { TokenType, type Token, type TokenKey } from "./token";

const MAX_DEPTH = 19;

export class Parser {
    private current: Token;
    private depth = 0;

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
        this.checkDepth();
        this.expect(TokenType.LEFT_BRACE);

        const object: JSONObject = {};

        if (this.current.type === TokenType.RIGHT_BRACE) {
            this.advance();
            this.depth--;
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
        this.depth--;

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
        this.checkDepth();
        this.expect(TokenType.LEFT_BRACKET);

        const array: JSONArray = [];

        if (this.current.type === TokenType.RIGHT_BRACKET) {
            this.advance();
            this.depth--;
            return array;
        }

        array.push(this.parseValue());

        while (this.current.type === TokenType.COMMA) {
            this.advance();

            array.push(this.parseValue());
        }

        this.expect(TokenType.RIGHT_BRACKET);
        this.depth--;

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

    private checkDepth(): void {
        this.depth++;
        if (this.depth > MAX_DEPTH) {
            throw new SyntaxError("Max depth exceeded");
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