export enum TokenType {
  Null,
  Number,
  Identifier,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Let,
  EOF, // Last character in a file
}

export interface Token {
  type: TokenType;
  value: string;
}

export const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  null: TokenType.Null,
};
