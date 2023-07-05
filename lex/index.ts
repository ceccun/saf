import { KEYWORDS, Token, TokenType } from "./const";
import { isAlphabetic, isInteger, isSkippable } from "./utils";

function buildToken(type: TokenType, value: string = ""): Token {
  return { type, value };
}

export function tokenize(input: string): Token[] {
  const tokens = new Array<Token>();
  const inputSplit = input.split("");

  while (inputSplit.length > 0) {
    if (inputSplit[0] == "(") {
      tokens.push(buildToken(TokenType.OpenParen, inputSplit.shift()));
    } else if (inputSplit[0] == ")") {
      tokens.push(buildToken(TokenType.CloseParen, inputSplit.shift()));
    } else if (
      inputSplit[0] == "+" ||
      inputSplit[0] == "-" ||
      inputSplit[0] == "*" ||
      inputSplit[0] == "/" ||
      inputSplit[0] == "%"
    ) {
      tokens.push(buildToken(TokenType.BinaryOperator, inputSplit.shift()));
    } else if (inputSplit[0] == "=") {
      tokens.push(buildToken(TokenType.Equals, inputSplit.shift()));
    } else {
      // TODO: Handle numbers and identifiers

      // Make numeric token
      if (isInteger(inputSplit[0])) {
        let num = "";

        while (inputSplit.length > 0 && isInteger(inputSplit[0])) {
          num += inputSplit.shift();
        }

        tokens.push(buildToken(TokenType.Number, num));
      } else if (isAlphabetic(inputSplit[0])) {
        let identifier = "";

        while (inputSplit.length > 0 && isAlphabetic(inputSplit[0])) {
          identifier += inputSplit.shift();
        }

        const reserved = KEYWORDS[identifier];
        if (typeof reserved != "number") {
          tokens.push(buildToken(TokenType.Identifier, identifier));
        } else {
          tokens.push(buildToken(reserved, identifier));
        }
      } else if (isSkippable(inputSplit[0])) {
        inputSplit.shift();
      } else {
        console.log("Unrecognised token in source: " + inputSplit[0]);
        process.exit(1);
      }
    }
  }

  tokens.push(buildToken(TokenType.EOF, "EndOfFile"));
  return tokens;
}
