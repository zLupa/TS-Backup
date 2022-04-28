import prompts from "prompts";
import { constants } from "fs";
import { access } from "fs/promises";
import { IConfig, saveConfig } from "../config/config";
import { googleDrivePrompt } from "./prompts/googleDrivePrompt";
import { localPrompt } from "./prompts/localPrompt";
import { exitOnCancel as onCancel } from "./utils/exitOnCancel";

export async function runInit() {
  let initConfig: IConfig = {
    type: "local",
    folders: [],
    discordWebhookUrl: "",
  };

  const { storageType } = await prompts(
    {
      name: "storageType",
      message: "What's the type of storage do you want to save your backups?",
      min: 1,
      type: "select",
      choices: [
        {
          title: "Local",
          value: "local",
        },
        {
          title: "Google Drive",
          value: "drive",
        },
      ],
    },
    { onCancel }
  );

  switch (storageType) {
    case "local":
      const { saveTo } = await localPrompt();
      initConfig.local = { saveTo };
      initConfig.type = "local";
      break;
    case "drive":
      const { folderId, credentials } = await googleDrivePrompt();
      initConfig.drive = { credentials, folderId };
      initConfig.type = "drive";
      break;
  }

  const { name } = await prompts(
    {
      name: "name",
      message:
        "What's the name that you what to give to this Backup? e.g. WebsiteBackup",
      min: 1,
      type: "text",
    },
    { onCancel }
  );

  const { path } = await prompts(
    {
      name: "path",
      message: `Where's located "${name}"? (full path)`,
      min: 1,
      type: "text",
      validate: async input => {
        try {
          await access(input, constants.R_OK);
          return true;
        } catch (error) {
          return "I don't have permission to view this folder or it doesn't exists!";
        }
      },
    },
    { onCancel }
  );

  const { discordWebhookUrl } = await prompts(
    {
      name: "discordWebhookUrl",
      message: "What's your discord webhook url?",
      type: "text",
    },
    { onCancel }
  );

  saveConfig({
    ...initConfig,
    discordWebhookUrl,
    folders: [
      {
        name,
        path,
      },
    ],
  });
}
