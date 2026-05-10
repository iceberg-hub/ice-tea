import type { Lexer } from "./lexer";
import { TokenType } from "./token";

export class Parser {
    constructor(private readonly lexer: Lexer) { }

    parse(): boolean {
        const first = this.lexer.nextToken();

        if (first.type !== TokenType.LEFT_BRACE) {
            return false;
        }

        const second = this.lexer.nextToken();

        if (second.type !== TokenType.RIGHT_BRACE) {
            return false;
        }

        const eof = this.lexer.nextToken();

        return eof.type === TokenType.EOF;
    }
}