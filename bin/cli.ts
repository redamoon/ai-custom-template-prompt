#!/usr/bin/env node

import { argv } from "process";

import init from "../src/commands/init.js";
import add from "../src/commands/add.js";
import list from "../src/commands/list.js";
import doctor from "../src/commands/doctor.js";

const [, , command, ...args] = argv;

async function main() {
  switch (command) {
    case "init":
      await init();
      break;
    case "add":
      await add(args);
      break;
    case "list":
      await list();
      break;
    case "doctor":
      await doctor();
      break;
    default:
      console.log(`
Usage: ai-custom-template-prompt <command>

Commands:
  init          初回セットアップ
  add <name>    特定テンプレートを追加
  list          利用可能なテンプレート一覧
  doctor        設定チェック
`);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

