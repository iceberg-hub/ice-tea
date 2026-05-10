export const TokenType = {
    LEFT_BRACE: "LEFT_BRACE",
    RIGHT_BRACE: "RIGHT_BRACE",
    LEFT_BRACKET: "LEFT_BRACKET",
    RIGHT_BRACKET: "RIGHT_BRACKET",
    COLON: "COLON",
    COMMA: "COMMA",
    STRING: "STRING",
    NUMBER: "NUMBER",
    TRUE: "TRUE",
    FALSE: "FALSE",
    NULL: "NULL",
    EOF: "EOF",
    INVALID: "INVALID"
} as const

export type TokenKey = keyof typeof TokenType;

export interface Token {
    type: string;
    value: string;
}