/* eslint-env node */
/**
 * Generate coverage badge
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getCoverageColor(percentage) {
  if (percentage >= 90) return "brightgreen";
  if (percentage >= 80) return "green";
  if (percentage >= 70) return "yellowgreen";
  if (percentage >= 60) return "yellow";
  if (percentage >= 50) return "orange";
  return "red";
}

function updateReadmeBadge(coverage) {
  const readmePath = path.join(__dirname, "..", "README.md");
  let readmeContent = fs.readFileSync(readmePath, "utf8");

  const coveragePercentage = Math.round(coverage.lines.pct);
  const color = getCoverageColor(coveragePercentage);

  const badgeRegex =
    /!\[Coverage\]\(https:\/\/img\.shields\.io\/badge\/coverage-[\d.]+%25-\w+\.svg\)/;
  const newBadge = `![Coverage](https://img.shields.io/badge/coverage-${coveragePercentage}%25-${color}.svg)`;
  readmeContent = readmeContent.replace(badgeRegex, newBadge);

  const coverageSectionRegex =
    /Current test coverage:\s*\n- \*\*Statements\*\*: [\d.]+%\s*\n- \*\*Branches\*\*: [\d.]+%\s*\n- \*\*Functions\*\*: [\d.]+%\s*\n- \*\*Lines\*\*: [\d.]+%/;
  const newCoverageSection = `Current test coverage:
- **Statements**: ${Math.round(coverage.statements.pct)}%
- **Branches**: ${Math.round(coverage.branches.pct)}%
- **Functions**: ${Math.round(coverage.functions.pct)}%
- **Lines**: ${Math.round(coverage.lines.pct)}%`;
  readmeContent = readmeContent.replace(
    coverageSectionRegex,
    newCoverageSection
  );

  fs.writeFileSync(readmePath, readmeContent);
  console.log(`✅ Updated README.md with coverage: ${coveragePercentage}%`);
}

function main() {
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
      // eslint-disable-next-line no-undef
      process.exit(1);
    }

    const coverageData = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
    updateReadmeBadge(coverageData.total);
  } catch (error) {
    console.error("❌ Error updating coverage badge:", error.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}

// run the script if called directly
// eslint-disable-next-line no-undef
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { updateReadmeBadge, getCoverageColor };
