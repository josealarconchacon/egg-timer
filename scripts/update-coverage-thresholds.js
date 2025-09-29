/**
 * Update coverage thresholds based on current coverage
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function updateThresholds() {
  try {
    const coveragePath = path.join(
      __dirname,
      "..",
      "coverage",
      "coverage-summary.json"
    );

    if (!fs.existsSync(coveragePath)) {
      console.log(
        '❌ Coverage summary not found. Run "npm run test:coverage" first.'
      );
      process.exit(1);
    }

    const coverageData = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
    const total = coverageData.total;

    const newThresholds = {
      branches: Math.max(20, Math.round(total.branches.pct - 5)),
      functions: Math.max(50, Math.round(total.functions.pct - 5)),
      lines: Math.max(50, Math.round(total.lines.pct - 5)),
      statements: Math.max(50, Math.round(total.statements.pct - 5)),
    };

    const jestConfigPath = path.join(__dirname, "..", "jest.config.js");
    let jestConfig = fs.readFileSync(jestConfigPath, "utf8");

    const thresholdRegex =
      /coverageThreshold:\s*{\s*global:\s*{\s*branches:\s*\d+,\s*functions:\s*\d+,\s*lines:\s*\d+,\s*statements:\s*\d+,\s*},\s*}/;
    const newThresholdConfig = `coverageThreshold: {
    global: {
      branches: ${newThresholds.branches},
      functions: ${newThresholds.functions},
      lines: ${newThresholds.lines},
      statements: ${newThresholds.statements},
    },
  }`;

    jestConfig = jestConfig.replace(thresholdRegex, newThresholdConfig);
    fs.writeFileSync(jestConfigPath, jestConfig);

    console.log("✅ Updated coverage thresholds:");
    console.log(`   Branches: ${newThresholds.branches}%`);
    console.log(`   Functions: ${newThresholds.functions}%`);
    console.log(`   Lines: ${newThresholds.lines}%`);
    console.log(`   Statements: ${newThresholds.statements}%`);
    console.log("\n💡 Current coverage:");
    console.log(`   Branches: ${Math.round(total.branches.pct)}%`);
    console.log(`   Functions: ${Math.round(total.functions.pct)}%`);
    console.log(`   Lines: ${Math.round(total.lines.pct)}%`);
    console.log(`   Statements: ${Math.round(total.statements.pct)}%`);
  } catch (error) {
    console.error("❌ Error updating thresholds:", error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  updateThresholds();
}

export { updateThresholds };
