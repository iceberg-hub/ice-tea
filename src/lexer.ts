import { TokenType, type Token } from "./token";

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

        const current = this.input[this.position++];

        switch (current) {
            case "{":
                return {
                    type: TokenType.LEFT_BRACE,
                    value: current,
                };

            case "}":
                return {
                    type: TokenType.RIGHT_BRACE,
                    value: current,
                };

            default:
                return {
                    type: TokenType.INVALID,
                    value: current ?? "INVALID",
                };
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
}