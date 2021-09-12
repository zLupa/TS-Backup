require("dotenv/config");

import { queue } from "./lib/queue";
import fs from "fs";
import dayjs from "dayjs";
import config from "./config/config.json";
import { mysqlBackup } from "./lib/mysqlBackup";
import { DiscordService } from "./services/DiscordService";

const BACKUP_PATH = config.backupPath;

async function RunBackup() {
  const currentTime = dayjs().format("DD-MM-YYYY-HH:mm:ss");
  const discordService = new DiscordService();

  fs.mkdirSync(`${BACKUP_PATH}/${currentTime}`, { recursive: true });

  await discordService.sendStartBackupMessage();

  try {
    console.log("Starting MySQL Backup...");
    mysqlBackup(`${BACKUP_PATH}/${currentTime}`);
    console.log("MySQL Backup finished, starting to backup the servers.");
  } catch (err) {
    await discordService.sendBackupErrorMessage("MySQL", err);
  }

  queue.error(async (err, task) => {
    if (err) {
      await discordService.sendBackupErrorMessage(task.name, err);
    }
  });

  for (const server of config.servers) {
    await queue.push({
      name: server.name,
      srcPath: server.path,
      dstPath: `${BACKUP_PATH}/${currentTime}`,
    });
  }

  console.log("Backup finished, have a great day! (:");
  await discordService.sendBackupFinishedMessage();
}
RunBackup();
