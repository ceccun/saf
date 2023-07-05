export function isAlphabetic(string: string) {
  return string.toUpperCase() != string.toLowerCase();
}

export function isInteger(char: string) {
  const charUnicode = char.charCodeAt(0);
  return charUnicode >= "0".charCodeAt(0) && charUnicode <= "9".charCodeAt(0);
}

export function isSkippable(char: string) {
  return char == " " || char == "\n" || char == "\t";
}
