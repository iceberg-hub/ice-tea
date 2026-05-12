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
                this.position++;
                return this.token(TokenType.STRING, value);
            }

            if (char === "\\") {
                const result = this.readEscapeSequence(value);
                if (result.token) return result.token;
                value = result.value;
                continue;
            }

            if (this.isControlCharacter(char)) {
                return this.token(TokenType.INVALID, value);
            }

            value += char;
            this.position++;
        }

        return this.token(TokenType.INVALID, value);
    }

    private readEscapeSequence(value: string): { token?: Token; value: string } {
        this.position++; // skip backslash
        const escape = this.input[this.position] ?? "";
        this.position++; // skip escape char

        switch (escape) {
            case '"': return { value: value + '"' };
            case "\\": return { value: value + "\\" };
            case "/": return { value: value + "/" };
            case "b": return { value: value + "\b" };
            case "f": return { value: value + "\f" };
            case "n": return { value: value + "\n" };
            case "r": return { value: value + "\r" };
            case "t": return { value: value + "\t" };
            case "u": return this.readUnicodeEscape(value);
            default: return { token: this.token(TokenType.INVALID, value), value };
        }
    }

    private readUnicodeEscape(value: string): { token?: Token; value: string } {
        const hex = this.input.slice(this.position, this.position + 4);
        if (hex.length < 4 || !/^[0-9a-fA-F]{4}$/.test(hex)) {
            return { token: this.token(TokenType.INVALID, value), value };
        }
        this.position += 4;
        return { value: value + String.fromCodePoint(Number.parseInt(hex, 16)) };
    }

    private isControlCharacter(char: string): boolean {
        return char <= "\u001F";
    }

    private readNumber(): Token {
        let value = "";

        if (this.input[this.position] === "-") {
            value += "-";
            this.position++;
        }

        const integerPart = this.readDigits();
        if (integerPart === "") {
            return this.token(TokenType.INVALID, value);
        }

        value += integerPart;

        if (integerPart.length > 1 && integerPart[0] === "0") {
            return this.token(TokenType.INVALID, value);
        }

        const decimalResult = this.readDecimalPart();
        if (decimalResult.token) return decimalResult.token;
        value += decimalResult.value ?? "";

        const exponentResult = this.readExponentPart();
        if (exponentResult.token) return exponentResult.token;
        value += exponentResult.value ?? "";

        return this.token(TokenType.NUMBER, value);
    }

    private readDigits(): string {
        let result = "";
        while (
            this.position < this.input.length &&
            this.isDigit(this.input[this.position] ?? "")
        ) {
            result += this.input[this.position];
            this.position++;
        }
        return result;
    }

    private readDecimalPart(): { token?: Token; value?: string } {
        if (this.position >= this.input.length || this.input[this.position] !== ".") {
            return {};
        }

        this.position++; // skip "."
        const digits = this.readDigits();
        if (digits === "") {
            return { token: this.token(TokenType.INVALID, ".") };
        }

        return { value: "." + digits };
    }

    private readExponentPart(): { token?: Token; value?: string } {
        if (this.position >= this.input.length || !/[eE]/.test(this.input[this.position] ?? "")) {
            return {};
        }

        const e = this.input[this.position] ?? "";
        this.position++; // skip e/E

        let sign = "";
        if (this.position < this.input.length && /[+-]/.test(this.input[this.position] ?? "")) {
            sign = this.input[this.position] ?? "";
            this.position++;
        }

        const digits = this.readDigits();
        if (digits === "") {
            return { token: this.token(TokenType.INVALID, e + sign) };
        }

        return { value: e + sign + digits };
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