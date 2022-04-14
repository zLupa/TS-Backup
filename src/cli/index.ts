import prompts from "prompts";
import { writeFile, mkdir, access } from "fs/promises";
import { constants } from "fs";
import chalk from "chalk";
import { homedir } from "os";

console.log(`
████████╗███████╗      ██████╗  █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗ 
╚══██╔══╝██╔════╝      ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗
   ██║   ███████╗█████╗██████╔╝███████║██║     █████╔╝ ██║   ██║██████╔╝
   ██║   ╚════██║╚════╝██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝ 
   ██║   ███████║      ██████╔╝██║  ██║╚██████╗██║  ██╗╚██████╔╝██║     
   ╚═╝   ╚══════╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     
                                                                        
`);

(async () => {
  const { storageType } = await prompts({
    name: "storageType",
    message: "What's type of storage do you want to save your Backups?",
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
    message: "Where do you want to save the Backups? (full path)",
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

  const { discordWebhookUrl } = await prompts({
    name: "discordWebhookUrl",
    message: "What's your discord webhook url?",
    type: "text",
  });

  try {
    await mkdir(`${homedir()}/.ts-backup/`, { recursive: true });
    await writeFile(
      `${homedir()}/.ts-backup/config.json`,
      JSON.stringify(
        {
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
        },
        null,
        2
      )
    );

    console.log(chalk.greenBright("✔ Configuration saved!"));
  } catch (error) {
    console.log(chalk.redBright("✘ Failed to create config file!\n", error));
  }
})();
