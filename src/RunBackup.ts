import { localQueue } from "./lib/local/localQueue";
import dayjs from "dayjs";
//import { mysqlBackup } from "./lib/mysqlBackup";
import { DiscordService } from "./services/DiscordService";
import { getConfig } from "./config/config";
import { mkdir } from "fs/promises";
import { driveQueue } from "./lib/drive/googleDriveQueue";
import { queueAsPromised } from "fastq";

const discordService = new DiscordService();

export async function RunBackup() {
  const { local, folders, type } = getConfig();

  const currentTime = dayjs().format("DD-MM-YYYY-HH:mm:ss");

  await discordService.sendStartBackupMessage();

  // I will work on this later
  /*try {
    console.log("Starting MySQL Backup...");
    mysqlBackup(`${local?.saveTo}/${currentTime}`);
    console.log("MySQL Backup finished, starting to backup the other folders.");
  } catch (err) {
    await discordService.sendBackupErrorMessage("MySQL", err);
  }*/

  for (const folder of folders) {
    switch (type) {
      case "local":
        await mkdir(`${local?.saveTo}/${currentTime}`, { recursive: true });
        setErrorReport(localQueue);
        await localQueue.push({
          name: folder.name,
          srcPath: folder.path,
          dstPath: `${local?.saveTo}/${currentTime}`,
        });
        break;
      case "drive":
        setErrorReport(driveQueue);
        await driveQueue.push({
          name: folder.name,
          srcPath: folder.path,
        });
        break;
    }
  }

  console.log("Backup finished, have a great day! (:");
  await discordService.sendBackupFinishedMessage();
}

function setErrorReport(queue: queueAsPromised) {
  queue.error(async (err, task) => {
    if (err) {
      await discordService.sendBackupErrorMessage(task.name, err);
    }
  });
}
