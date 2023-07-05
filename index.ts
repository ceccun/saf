import Parser from "./ast/parser";
import prompts from "prompts";
import { readFileSync } from "fs";
import utils from "util";

async function saf() {
  const parser = new Parser();
  console.log("Saf Language version 0.0.1");
  console.log(
    "This is an experimental language, do not use for production software."
  );
  console.log(
    "Please report bugs to Ceccun via Saf's GitHub repository:\nhttps://github.com/ceccun/saf"
  );
  while (true) {
    const input = await prompts({
      type: "text",
      name: "value",
      message: "",
    });

    const response = input.value;

    // const response = readFileSync("./app.saf", "utf-8");

    // Check if input is empty
    if (!response || response === "exit" || response === "quit") {
      process.exit(1);
    }

    const program = parser.produceAST(response);
    console.log(
      utils.inspect(program, {
        depth: Infinity,
        colors: true,
      })
    );
  }
}

saf();
