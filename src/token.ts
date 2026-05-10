export const TokenType = {
    LEFT_BRACE: "LEFT_BRACE",
    RIGHT_BRACE: "RIGHT_BRACE",
    EOF: "EOF",
    INVALID: "INVALID"
} as const

export interface Token {
    type: string;
    value: string;
}