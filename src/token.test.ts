import { test, expect, describe } from "bun:test";
import { TokenType } from "./token";

describe("TokenType", () => {
    test("has expected enum values", () => {
        expect(TokenType.LEFT_BRACE).toBe("LEFT_BRACE");
        expect(TokenType.RIGHT_BRACE).toBe("RIGHT_BRACE");
        expect(TokenType.EOF).toBe("EOF");
        expect(TokenType.INVALID).toBe("INVALID");
    });

    test("enum has exactly 4 members", () => {
        const keys = Object.keys(TokenType).filter((k) => isNaN(Number(k)));
        expect(keys.length).toBe(4);
    });
});
