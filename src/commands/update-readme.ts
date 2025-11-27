import fs from "fs";
import path from "path";
import { generateReadme } from "../core/readme-generator.js";

export default async function updateReadme() {
  const projectRoot = process.cwd();
  const readmePath = path.join(projectRoot, "README.md");
  const backupPath = path.join(projectRoot, "README.md.backup");
  
  try {
    // 既存のREADMEをバックアップ
    if (fs.existsSync(readmePath)) {
      fs.copyFileSync(readmePath, backupPath);
      console.log(`✔ 既存のREADMEをバックアップしました: README.md.backup`);
    }
    
    // READMEを生成
    const readmeContent = generateReadme();
    
    // READMEを書き込み
    fs.writeFileSync(readmePath, readmeContent, "utf-8");
    
    console.log(`✔ READMEを生成しました: README.md`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Error: READMEの生成に失敗しました");
    }
    process.exit(1);
  }
}

