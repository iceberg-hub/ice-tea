import { test, expect, describe } from "bun:test";
import { TokenType } from "./token";

describe("TokenType", () => {
    test("has correct string values for all token types", () => {
        expect(TokenType.LEFT_BRACE).toBe("LEFT_BRACE");
        expect(TokenType.RIGHT_BRACE).toBe("RIGHT_BRACE");
        expect(TokenType.LEFT_BRACKET).toBe("LEFT_BRACKET");
        expect(TokenType.RIGHT_BRACKET).toBe("RIGHT_BRACKET");
        expect(TokenType.COLON).toBe("COLON");
        expect(TokenType.COMMA).toBe("COMMA");
        expect(TokenType.STRING).toBe("STRING");
        expect(TokenType.NUMBER).toBe("NUMBER");
        expect(TokenType.TRUE).toBe("TRUE");
        expect(TokenType.FALSE).toBe("FALSE");
        expect(TokenType.NULL).toBe("NULL");
        expect(TokenType.EOF).toBe("EOF");
        expect(TokenType.INVALID).toBe("INVALID");
    });

    test("has exactly 13 members", () => {
        const keys = Object.keys(TokenType).filter((k) => isNaN(Number(k)));
        expect(keys.length).toBe(13);
    });
});
