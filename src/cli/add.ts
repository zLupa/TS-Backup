import prompts from "prompts";
import { access } from "fs/promises";
import { constants } from "fs";
import { getConfig, saveConfig } from "../config/config";

export async function runAddFolder(saveConfigToDisk: boolean = true) {
  const config = getConfig();

  const { name } = await prompts({
    name: "name",
    message:
      "What's the name that you what to give to this Backup? e.g. WebsiteBackup",
    type: "text",
  });

  const { path } = await prompts({
    name: "path",
    message: `Where's located "${name}"? (full path)`,
    type: "text",
    validate: async input => {
      try {
        await access(input, constants.R_OK);
        return true;
      } catch (error) {
        return "I don't have permission to view this folder or it doesn't exists!";
      }
    },
  });

  if (saveConfigToDisk) {
    config.folders.push({ name, path });
    saveConfig(config);
  }

  return { name, path };
}
