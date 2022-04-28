import chalk from "chalk";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { Credentials } from "google-auth-library";
import { homedir } from "os";

interface IBackupFolder {
  name: string;
  path: string;
}

export interface IConfig {
  type: "local" | "drive";
  local?: {
    saveTo: string;
  };
  drive?: {
    credentials: Credentials;
    folderId?: string;
  };
  folders: IBackupFolder[];
  discordWebhookUrl: string;
}

const configLocation = `${homedir()}/.ts-backup/config.json`;
const configFolder = `${homedir()}/.ts-backup/`;

export function getConfig(): IConfig {
  if (!existsSync(configLocation)) {
    console.log(
      chalk.red(
        "Config file not found. Make sure you initialized with the init command"
      )
    );
    process.exit(1);
  }

  try {
    const configFile = readFileSync(configLocation, "utf-8");
    const configObject = JSON.parse(configFile);

    return configObject;
  } catch (error) {
    console.log(
      chalk.red(
        `Failed to parse configuration file at ${configLocation}.\nYou can overwrite it by running the init command.\nError: ${error}`
      )
    );
    process.exit(1);
  }
}

export function saveConfig(
  config: IConfig,
  outputMessage: boolean = true
): IConfig {
  try {
    mkdirSync(configFolder, { recursive: true });
    writeFileSync(configLocation, JSON.stringify(config, null, 2));
    if (outputMessage) {
      console.log(chalk.greenBright("✔ Configuration saved!"));
    }
  } catch (error) {
    console.log(chalk.red("Failed to save configuration file to disk!", error));
  }

  return config;
}
