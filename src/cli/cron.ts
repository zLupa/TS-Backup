import chalk from "chalk";
import prompts from "prompts";
import { getConfig } from "../config/config";
import { exitOnCancel as onCancel } from "./utils/exitOnCancel";

export async function addCron(fileName: string) {
  const { folders } = getConfig();

  if (folders.length == 0) {
    console.log(
      chalk.red(
        "You must run the init command first before adding cron expression!"
      )
    );

    return;
  }

  const folderChoices: prompts.Choice[] = [];

  folders.forEach(folder =>
    folderChoices.push({ title: folder.name, value: folder.name })
  );

  const { runForFolders } = (await prompts(
    {
      name: "runForFolders",
      type: "multiselect",
      message: "What folder do you want to run with this cron?",
      min: 1,
      instructions: "\n  a: Toggle all\n  [space]: Toggle selection ",
      choices: [...folderChoices],
    },
    { onCancel }
  )) as { runForFolders: string[] };

  const { expression } = await prompts(
    {
      name: "expression",
      type: "select",
      message: "Select cron expression",
      choices: [
        {
          title: "Every 1 hour",
          value: `0 * * * *`,
        },
        {
          title: "Every day at 1am",
          value: "0 1 * * *",
        },
        {
          title: "Every week",
          value: "0 0 * * 0",
        },
        {
          title: "Every month",
          value: "0 0 1 * *",
        },
      ],
    },
    { onCancel }
  );

  const cronjob = `\nSHELL=/bin/sh\nPATH=${process.env.PATH}\n\n${expression} root ${fileName} run >> /var/log/ts-backup.log 2>&1`;

  console.log(
    chalk.bold.green(`✔ Great! Now, add this job to your cron:\n${cronjob}`)
  );

  return;
}
