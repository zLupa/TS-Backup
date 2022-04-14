import { queue } from "./lib/queue";
import dayjs from "dayjs";
//import { mysqlBackup } from "./lib/mysqlBackup";
import { DiscordService } from "./services/DiscordService";
import { getConfig } from "./config/config";
import { mkdir } from "fs/promises";

async function RunBackup() {
  const { local, folders } = getConfig();

  const currentTime = dayjs().format("DD-MM-YYYY-HH:mm:ss");
  const discordService = new DiscordService();

  await mkdir(`${local?.saveTo}/${currentTime}`, { recursive: true });

  await discordService.sendStartBackupMessage();

  // I will work on this later
  /*try {
    console.log("Starting MySQL Backup...");
    mysqlBackup(`${local?.saveTo}/${currentTime}`);
    console.log("MySQL Backup finished, starting to backup the other folders.");
  } catch (err) {
    await discordService.sendBackupErrorMessage("MySQL", err);
  }*/

  queue.error(async (err, task) => {
    if (err) {
      await discordService.sendBackupErrorMessage(task.name, err);
    }
  });

  for (const folder of folders) {
    await queue.push({
      name: folder.name,
      srcPath: folder.path,
      dstPath: `${local?.saveTo}/${currentTime}`,
    });
  }

  console.log("Backup finished, have a great day! (:");
  await discordService.sendBackupFinishedMessage();
}
RunBackup();
