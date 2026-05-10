import type { Lexer } from "./lexer";
import { TokenType, type Token, type TokenKey } from "./token";

export class Parser {
    private current: Token;

    constructor(private readonly lexer: Lexer) {
        this.current = this.lexer.nextToken();
    }

    parse(): boolean {
        const valid = this.parseObject();

        return valid && this.current.type === TokenType.EOF;
    }

    private parseObject(): boolean {
        if (!this.expect(TokenType.LEFT_BRACE)) {
            return false;
        }

        // empty object {}
        if (this.current.type === TokenType.RIGHT_BRACE) {
            this.advance();
            return true;
        }

        if (!this.parsePair()) {
            return false;
        }

        while (this.current.type === TokenType.COMMA) {
            this.advance();

            if (!this.parsePair()) {
                return false;
            }
        }

        if (!this.expect(TokenType.RIGHT_BRACE)) {
            return false;
        }

        return true;
    }

    private parsePair(): boolean {
        if (!this.expect(TokenType.STRING)) {
            return false;
        }

        if (!this.expect(TokenType.COLON)) {
            return false;
        }

        return this.parseValue();
    }

    private parseValue(): boolean {
        switch (this.current.type) {
            case TokenType.STRING:
            case TokenType.NUMBER:
            case TokenType.TRUE:
            case TokenType.FALSE:
            case TokenType.NULL:
                this.advance();
                return true;

            default:
                return false;
        }
    }

    private expect(type: TokenKey): boolean {
        if (this.current.type !== type) {
            return false;
        }

        this.advance();

        return true;
    }

    private advance() {
        this.current = this.lexer.nextToken();
    }
}