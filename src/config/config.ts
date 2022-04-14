import { readFileSync } from "fs";
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
