import chalk from "chalk";
import { createInterface } from "readline";
import { urls } from "../baseConfig";
import { $ } from "bun";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const loadingFrames = ["-", "\\", "|", "/"];

async function pullRepos() {
  await $`mkdir -p src`;
  for (const repo of urls) {
    if (repo.name === "package") {
      const answer = await askUserConfirmation(
        `Do you also want to pull the "${repo.name}" repository? (y/n) `
      );
      if (answer.toLowerCase() === "y" || answer === "") {
        await cloneRepo(repo.url, `src/${repo.name}`);
      } else {
        console.log(`Skipping "${repo.name}" pull.`);
      }
    } else {
      await cloneRepo(repo.url, `src/${repo.name}`);
    }
  }
}

async function askUserConfirmation(question: string): Promise<string> {
  return new Promise((resolve) =>
    readline.question(question, (answer) => resolve(answer))
  );
}

async function installDeps() {
  for (const url of urls) {
    console.log(chalk.blueBright(`Installing dependencies for ${url.name}`));
    console.log("\n");
    await $`cd src/${url.name} && bun install`.catch((err) => {
      console.log(err);
    });

    await $`cp .env src/${url.name}/.env`;

    if (url.name === "backend") {
      await $`cd src/${url.name} && mkdir -p databases`;
    }

    console.log("\n");
    console.log(
      chalk.greenBright(`Successfully installed dependencies for ${url.name}`)
    );
    console.log("\n");
  }
}

async function cloneRepo(url: string, name: string) {
  let currentFrame = 0;
  console.log(chalk.green(`Pulling repository: ${name}`));
  console.log(`\n`);

  const intervalId = setInterval(() => {
    process.stdout.write(`\b${loadingFrames[currentFrame]}`);
    currentFrame = (currentFrame + 1) % loadingFrames.length;
  }, 200);

  try {
    await $`git clone ${url} ${name} --progress`;
    console.log(`\n`);
    console.log(chalk.green(`Successfully cloned "${name}" repository!`));
  } catch (err) {
    console.log(err, chalk.red(`Failed to clone ${name}`));
  }

  clearInterval(intervalId);
  process.stdout.write("\n");
  console.log(`\n`);
}

pullRepos()
  .then(async () => await installDeps())
  .catch((error) => console.error(error))
  .finally(() => {
    process.exit(0);
  });
