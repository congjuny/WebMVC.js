#!/usr/bin/env node

import { execSync } from "child_process";
import { writeFileSync, mkdirSync, readFileSync, existsSync, copyFile, cpSync } from "fs";
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
  --full         Create a full-stack application
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

function createProject(projectName) {
  console.log(pc.cyan(`\n📦 Creating project: ${projectName}\n`));

  // Create project directory
  mkdirSync(projectName);
  process.chdir(projectName);

  const replacements = {
    PROJECT_NAME: projectName,
    DESCRIPTION: `A WebMVC.js application built with Vite`,
    FRONTEND_ROOT: frontendRoot,
  };

  console.log("📝 Creating files...");

  // Create package.json
  let origTemplate = readTemplate("package.json.template");
  let processedTemplate = processTemplate(origTemplate, replacements);
  writeFileSync("package.json", processedTemplate);

  // Create vite.config.js
  origTemplate = readTemplate("vite.config.js.template");
  processedTemplate = processTemplate(origTemplate, replacements);
  writeFileSync("vite.config.js", processedTemplate);

  // Create .gitignore
  origTemplate = readTemplate("gitignore.template");
  writeFileSync(".gitignore", origTemplate);

  // Create README.md
  origTemplate = readTemplate("README.md.template");
  processedTemplate = processTemplate(origTemplate, replacements);
  writeFileSync("README.md", processedTemplate);

  if (fullStack) {
    mkdirSync("frontend");
    mkdirSync("backend");
    process.chdir("frontend");
  }

  origTemplate = readTemplate("index.html.template");
  processedTemplate = processTemplate(origTemplate, replacements);
  writeFileSync("index.html", processedTemplate);

  mkdirSync("public");
  mkdirSync("src");

  let fileName = join(__dirname, "templates", "public/favicon.ico");
  copyFile(fileName, "public/favicon.ico", (err) => {
    if (err) throw err;
  });

  fileName = join(__dirname, "templates", "style.css.template");
  copyFile(fileName, "style.css", (err) => {
    if (err) throw err;
  });

  process.chdir("src");

  fileName = join(__dirname, "templates", "src/App.jsx.template");
  copyFile(fileName, "App.jsx", (err) => {
    if (err) throw err;
  });

  fileName = join(__dirname, "templates", "src/pages");
  cpSync(fileName, "pages", { recursive: true }, (err) => {
    if (err) throw err;
  });

  fileName = join(__dirname, "templates", "src/components");
  cpSync(fileName, "components", { recursive: true }, (err) => {
    if (err) throw err;
  });

  // Create entry point main.jsx
  origTemplate = readTemplate("src/main.jsx.template");
  processedTemplate = processTemplate(origTemplate, replacements);
  writeFileSync("main.jsx", processedTemplate);

  // Initialize git
  if (initGit) {
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
  if (install_pkg) {
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
  if (!install_pkg) {
    console.log("  npm install");
  }
  console.log("  npm run build");
  console.log("  npm start");
  console.log("");
}

// options and default values
let projectName = "";
let fullStack = false;
let frontendRoot = ".";
let initGit = false;
let install_pkg = false;

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

  projectName = args.find((arg) => !arg.startsWith("-"));
  install_pkg = args.includes("--install");
  initGit = args.includes("--init-git");
  fullStack = args.includes("--full");
  frontendRoot = fullStack ? "frontend" : ".";

  validateProjectName(projectName);
  createProject(projectName);
}

main();
