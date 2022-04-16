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

  let runForFoldersWithExpression =
    runForFolders.length == 1
      ? `${expression} root ${fileName} run ${runForFolders[0]}`
      : runForFolders
          .map(folder => `${expression} root ${fileName} run ${folder}`)
          .join("\n");

  runForFoldersWithExpression = `\nSHELL=/bin/sh\nPATH=${process.env.PATH}\n\n${runForFoldersWithExpression}`;

  console.log(
    chalk.bold.green(
      `✔ Great! Now, add this job${
        runForFolders.length > 1 ? "s" : ""
      } to your cron:`
    )
  );

  console.log(runForFoldersWithExpression);

  return;
}
