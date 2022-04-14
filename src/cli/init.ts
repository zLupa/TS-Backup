import { constants } from "fs";
import { access } from "fs/promises";
import prompts from "prompts";
import { saveConfig } from "../config/config";
import { runAddFolder } from "./add";

export async function runInit() {
  const { storageType } = await prompts({
    name: "storageType",
    message: "What's the type of storage do you want to save your backups?",
    type: "select",
    choices: [
      {
        title: "Local",
        value: "local",
      },
    ],
  });

  const { saveTo } = await prompts({
    name: "saveTo",
    message: "Where do you want to save the backups? (full path)",
    type: storageType === "local" ? "text" : null,
    validate: async input => {
      try {
        await access(input, constants.R_OK);
        return true;
      } catch (error) {
        return "I don't have permission to view this folder or it doesn't exists!";
      }
    },
  });

  const { name, path } = await runAddFolder(false);

  const { discordWebhookUrl } = await prompts({
    name: "discordWebhookUrl",
    message: "What's your discord webhook url?",
    type: "text",
  });

  saveConfig({
    type: storageType,
    local: {
      saveTo,
    },
    folders: [
      {
        name,
        path,
      },
    ],
    discordWebhookUrl,
  });
}
