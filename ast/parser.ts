import {
  Statement,
  Program,
  Expression,
  BinaryExpression,
  NumericLiteral,
  Identifier,
  NullLiteral,
} from "./types";

import { tokenize } from "../lex";
import { Token, TokenType } from "../lex/const";

export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): boolean {
    return this.tokens[0].type !== TokenType.EOF;
  }

  private now() {
    return this.tokens[0] as Token;
  }

  private next() {
    return this.tokens.shift() as Token;
  }

  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.log("Parser Error: \n", err, prev, "- Expecting: ", type);
      process.exit(1);
    }
  }

  // fooBar

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Parser
    while (this.not_eof()) {
      program.body.push(this.parseStatement());
    }

    return program;
  }

  private parseStatement(): Statement {
    return this.parseExpression();
  }

  private parseExpression(): Expression {
    return this.parseAdditiveExpression();
  }

  private parseAdditiveExpression(): Expression {
    let left = this.parseMultiplicativeExpression();

    while (this.now().value == "+" || this.now().value == "-") {
      const operator = this.next().value;
      const right = this.parseMultiplicativeExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  private parseMultiplicativeExpression(): Expression {
    let left = this.parsePrimaryExpression();

    while (
      this.now().value == "*" ||
      this.now().value == "/" ||
      this.now().value == "%"
    ) {
      const operator = this.next().value;
      const right = this.parsePrimaryExpression();
      left = {
        kind: "BinaryExpression",
        left,
        right,
        operator,
      } as BinaryExpression;
    }

    return left;
  }

  // Orders of precedence
  // AdditiveExpression
  // MultiplicativeExpression
  // PrimaryExpression

  private parsePrimaryExpression(): Expression {
    const tokType = this.now().type;

    switch (tokType) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.next().value } as Identifier;

      case TokenType.Null:
        this.next();
        return { kind: "NullLiteral", value: "null" } as NullLiteral;
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.next().value),
        } as NumericLiteral;

      case TokenType.OpenParen:
        this.next();
        const value = this.parseExpression();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found while expecting closed curved brackets"
        );
        return value;
      default:
        console.error("Unexpected token found during parsing: ", this.now());
        // Lie bro
        process.exit(1);
    }
  }
}
