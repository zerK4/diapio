# Diapio builder package

## Prerequisites
Install bun

```bash
cp .env.example .env
```
Add the required data inside the newly created .env.

```bash
bun install
bun scripts/spawn.ts
```

## What it does?
1. Creates a src folder.
2. Clone diapio repositories in src folder.
3. Installs the dependencies for each package.
4. Copies the env inside all the packages.

## Add more env variables
To add more env variables edit the .env and .env-example and then run

```bash
bun scripts/renv.ts
```
This command will copy the updated env file to all the project.

## Start the project
You can start the project package by package or all at once.

```bash
bun run dev # will run all the dev files inside the packages.
bun run dev:fe | dev:be # run a single package, you can extend this from package.json as you wish.
```


