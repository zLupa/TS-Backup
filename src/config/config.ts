import chalk from "chalk";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";

interface IBackupFolder {
  name: string;
  path: string;
}

export interface IConfig {
  type: "local";
  local?: {
    saveTo: string;
  };
  folders: IBackupFolder[];
  discordWebhookUrl: string;
}

export function getConfig(): IConfig {
  const configFile = readFileSync(
    `${homedir()}/.ts-backup/config.json`,
    "utf-8"
  );

  return JSON.parse(configFile);
}

export function saveConfig(
  config: IConfig,
  outputMessage: boolean = true
): IConfig {
  try {
    mkdirSync(`${homedir()}/.ts-backup/`, { recursive: true });
    writeFileSync(
      `${homedir()}/.ts-backup/config.json`,
      JSON.stringify(config)
    );
    if (outputMessage) {
      console.log(chalk.greenBright("✔ Configuration saved!"));
    }
  } catch (error) {
    console.log(chalk.redBright("✘ Failed to create config file!\n", error));
  }

  return config;
}
