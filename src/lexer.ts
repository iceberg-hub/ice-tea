import { TokenType, type Token, type TokenKey } from "./token";

export class Lexer {
    private position = 0;

    constructor(private readonly input: string) { }

    nextToken(): Token {
        this.skipWhitespace();

        if (this.position >= this.input.length) {
            return {
                type: TokenType.EOF,
                value: "",
            };
        }

        const current = this.input[this.position] ?? "";

        switch (current) {
            case "{":
                this.position++;
                return this.token(TokenType.LEFT_BRACE, "{");
            case "}":
                this.position++;
                return this.token(TokenType.RIGHT_BRACE, "}");
            case "[":
                this.position++;
                return this.token(TokenType.LEFT_BRACKET, "[");
            case "]":
                this.position++;
                return this.token(TokenType.RIGHT_BRACKET, "]");
            case ":":
                this.position++;
                return this.token(TokenType.COLON, ":");
            case ",":
                this.position++;
                return this.token(TokenType.COMMA, ",");
            case '"':
                return this.readString();
        }

        if (this.isDigit(current) || current === "-") {
            return this.readNumber();
        }

        if (this.isAlpha(current)) {
            return this.readKeyword();
        }

        this.position++;

        return this.token(TokenType.INVALID, current ?? "I");
    }

    private readString(): Token {
        this.position++; // skip opening quote

        let value = "";

        while (
            this.position < this.input.length &&
            this.input[this.position] !== '"'
        ) {
            value += this.input[this.position];
            this.position++;
        }

        if (this.position >= this.input.length) {
            return this.token(TokenType.INVALID, value);
        }

        this.position++; // closing quote

        return this.token(TokenType.STRING, value);
    }

    private readNumber(): Token {
        let value = "";

        if (this.input[this.position] === "-") {
            value += "-";
            this.position++;
        }

        while (
            this.position < this.input.length &&
            this.isDigit(this.input[this.position] ?? "")
        ) {
            value += this.input[this.position];
            this.position++;
        }

        return this.token(TokenType.NUMBER, value);
    }

    private readKeyword(): Token {
        let value = "";

        while (
            this.position < this.input.length &&
            this.isAlpha(this.input[this.position] ?? "")
        ) {
            value += this.input[this.position];
            this.position++;
        }

        switch (value) {
            case "true":
                return this.token(TokenType.TRUE, value);

            case "false":
                return this.token(TokenType.FALSE, value);

            case "null":
                return this.token(TokenType.NULL, value);

            default:
                return this.token(TokenType.INVALID, value);
        }
    }

    private skipWhitespace() {
        while (
            this.position < this.input.length &&
            /\s/.test(this.input[this.position] ?? "")
        ) {
            this.position++;
        }
    }

    private isDigit(char: string): boolean {
        return /[0-9]/.test(char);
    }

    private isAlpha(char: string): boolean {
        return /[a-z]/i.test(char);
    }

    private token(type: TokenKey, value: string): Token {
        return { type, value };
    }
}