#!/usr/bin/env node

import { execSync } from "child_process";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import pc from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

function showHelp() {
  console.log(`
${pc.cyan("create-web-mvc-app")} - Scaffold Node.js applications with Vite

${pc.yellow("Usage:")}
  npx create-web-mvc-app <project-name> [options]

${pc.yellow("Options:")}
  -h, --help     Show this help message
  -v, --version  Show version number
  --no-install   Skip npm install
  --no-git       Skip git initialization

${pc.yellow("Examples:")}
  npx create-web-mvc-app my-app
  npx create-web-mvc-app my-app --no-install
`);
}

function showVersion() {
  const packageJson = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf8"));
  console.log(packageJson.version);
}

function validateProjectName(name) {
  if (!name) {
    console.error(pc.red("Error: Project name is required"));
    showHelp();
    process.exit(1);
  }

  if (name.match(/[^a-zA-Z0-9-_]/)) {
    console.error(pc.red("Error: Project name can only contain letters, numbers, hyphens, and underscores"));
    process.exit(1);
  }

  if (existsSync(name)) {
    console.error(pc.red(`Error: Directory "${name}" already exists`));
    process.exit(1);
  }
}

function readTemplate(templateName) {
  const templatePath = join(__dirname, "templates", templateName);
  return readFileSync(templatePath, "utf8");
}

function processTemplate(template, replacements) {
  let processed = template;
  for (const [key, value] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  return processed;
}

function createProject(projectName, options = {}) {
  const { skipInstall = false, skipGit = false } = options;

  console.log(pc.cyan(`\n📦 Creating project: ${projectName}\n`));

  // Create project directory
  mkdirSync(projectName);
  process.chdir(projectName);

  const replacements = {
    PROJECT_NAME: projectName,
    DESCRIPTION: `A Node.js application built with Vite`,
  };

  console.log("📝 Creating files...");

  // Create package.json
  const packageTemplate = readTemplate("package.json.template");
  const packageJson = processTemplate(packageTemplate, replacements);
  writeFileSync("package.json", packageJson);

  // Create vite.config.js
  const viteTemplate = readTemplate("vite.config.js.template");
  writeFileSync("vite.config.js", viteTemplate);

  // Create src directory and index.js
  mkdirSync("src");
  const indexTemplate = readTemplate("src/index.js.template");
  const indexJs = processTemplate(indexTemplate, replacements);
  writeFileSync("src/index.js", indexJs);

  // Create .gitignore
  const gitignoreTemplate = readTemplate("gitignore.template");
  writeFileSync(".gitignore", gitignoreTemplate);

  // Create README.md
  const readmeContent = `# ${projectName}

A Node.js application built with Vite.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm start

# Development mode (build + watch)
npm run dev
\`\`\`

## Scripts

- \`npm run build\` - Build the application
- \`npm run dev\` - Build in watch mode
- \`npm start\` - Start the built application
`;

  writeFileSync("README.md", readmeContent);

  // Initialize git
  if (!skipGit) {
    try {
      console.log("🔧 Initializing git repository...");
      execSync("git init", { stdio: "pipe" });
      execSync("git add .", { stdio: "pipe" });
      execSync('git commit -m "Initial commit"', { stdio: "pipe" });
    } catch (error) {
      console.log(pc.yellow("⚠️  Could not initialize git repository"));
    }
  }

  // Install dependencies
  if (!skipInstall) {
    console.log("📥 Installing dependencies...");
    try {
      execSync("npm install", { stdio: "inherit" });
    } catch (error) {
      console.error(pc.red("❌ Failed to install dependencies"));
      console.log(pc.yellow("You can install them manually with: npm install"));
    }
  }

  console.log(pc.green("\n✅ Project created successfully!\n"));
  console.log(pc.cyan("Next steps:"));
  console.log(`  cd ${projectName}`);
  if (skipInstall) console.log("  npm install");
  console.log("  npm run build");
  console.log("  npm start");
  console.log("");
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes("-h") || args.includes("--help")) {
    showHelp();
    return;
  }

  if (args.includes("-v") || args.includes("--version")) {
    showVersion();
    return;
  }

  const projectName = args.find((arg) => !arg.startsWith("-"));
  const skipInstall = args.includes("--no-install");
  const skipGit = args.includes("--no-git");

  validateProjectName(projectName);
  createProject(projectName, { skipInstall, skipGit });
}

main();
