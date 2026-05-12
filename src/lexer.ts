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

        while (this.position < this.input.length) {
            const char = this.input[this.position] ?? "";

            if (char === '"') {
                this.position++; // closing quote
                return this.token(TokenType.STRING, value);
            }

            if (char === "\\") {
                this.position++;
                const escape = this.input[this.position] ?? "";

                switch (escape) {
                    case '"':
                        value += '"';
                        break;
                    case "\\":
                        value += "\\";
                        break;
                    case "/":
                        value += "/";
                        break;
                    case "b":
                        value += "\b";
                        break;
                    case "f":
                        value += "\f";
                        break;
                    case "n":
                        value += "\n";
                        break;
                    case "r":
                        value += "\r";
                        break;
                    case "t":
                        value += "\t";
                        break;
                    case "u": {
                        const hex = this.input.slice(this.position + 1, this.position + 5);
                        if (hex.length < 4 || !/^[0-9a-fA-F]{4}$/.test(hex)) {
                            return this.token(TokenType.INVALID, value);
                        }
                        value += String.fromCodePoint(Number.parseInt(hex, 16));
                        this.position += 4;
                        break;
                    }
                    default:
                        return this.token(TokenType.INVALID, value);
                }

                this.position++;
                continue;
            }

            // Reject unescaped control characters (U+0000 - U+001F)
            if (char <= "\u001F") {
                return this.token(TokenType.INVALID, value);
            }

            value += char;
            this.position++;
        }

        // Reached end of input without closing quote
        return this.token(TokenType.INVALID, value);
    }

    private readNumber(): Token {
        let value = "";

        if (this.input[this.position] === "-") {
            value += "-";
            this.position++;
        }

        // Read integer part
        let integerPart = "";
        while (
            this.position < this.input.length &&
            this.isDigit(this.input[this.position] ?? "")
        ) {
            integerPart += this.input[this.position];
            this.position++;
        }

        if (integerPart === "") {
            return this.token(TokenType.INVALID, value);
        }

        value += integerPart;

        const hasLeadingZero = integerPart.length > 1 && integerPart[0] === "0";

        // Decimal part
        if (this.position < this.input.length && this.input[this.position] === ".") {
            value += ".";
            this.position++;

            if (this.position >= this.input.length || !this.isDigit(this.input[this.position] ?? "")) {
                return this.token(TokenType.INVALID, value);
            }

            while (
                this.position < this.input.length &&
                this.isDigit(this.input[this.position] ?? "")
            ) {
                value += this.input[this.position];
                this.position++;
            }
        }

        // Exponent part
        if (this.position < this.input.length && /[eE]/.test(this.input[this.position] ?? "")) {
            value += this.input[this.position];
            this.position++;

            if (this.position < this.input.length && /[+-]/.test(this.input[this.position] ?? "")) {
                value += this.input[this.position];
                this.position++;
            }

            if (this.position >= this.input.length || !this.isDigit(this.input[this.position] ?? "")) {
                return this.token(TokenType.INVALID, value);
            }

            while (
                this.position < this.input.length &&
                this.isDigit(this.input[this.position] ?? "")
            ) {
                value += this.input[this.position];
                this.position++;
            }
        }

        if (hasLeadingZero) {
            return this.token(TokenType.INVALID, value);
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