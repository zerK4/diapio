import { $ } from "bun";
import chalk from "chalk";
import { urls } from "../baseConfig";

async function main() {
  for (const url of urls) {
    console.log("\n");
    console.log(chalk.green(`Copying env variables to ${url.name}...`));
    await $`cp .env ${url.name}/.env`.catch((err) => {
      console.log(err);
    });
    console.log(
      chalk.blueBright(`Successfully copied env variables to ${url.name}`)
    );
  }
}

await main();
