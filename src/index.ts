import fs from "node:fs";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

const filePath = process.argv[2];

if (!filePath) {
    console.error("Missing file path");
    process.exit(1);
}

try {
    const content = fs.readFileSync(filePath, "utf-8");

    const lexer = new Lexer(content);
    const parser = new Parser(lexer);

    const parsed = parser.parse();

    console.log(JSON.stringify(parsed, null, 2));
} catch (error) {
    console.error(error);
    process.exit(1);
}