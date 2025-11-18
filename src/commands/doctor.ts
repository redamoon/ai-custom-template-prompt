import fs from "fs";
import { TEMPLATE_MAP } from "../core/config.js";

export default async function doctor() {
  console.log("Running diagnostics...\n");

  console.log("Checking template destinations:\n");

  for (const [key, def] of Object.entries(TEMPLATE_MAP)) {
    const exists = fs.existsSync(def.to);
    const dir = def.to.split("/").slice(0, -1).join("/");
    const dirExists = dir ? fs.existsSync(dir) : true;

    console.log(`  ${key}:`);
    console.log(`    Directory: ${dirExists ? "✔" : "✖"} ${dir || "."}`);
    console.log(`    File: ${exists ? "✔" : "✖"} ${def.to}`);
    console.log();
  }

  console.log("Done!");
}

