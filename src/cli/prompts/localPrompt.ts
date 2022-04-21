import { constants } from "fs";
import { access } from "fs/promises";
import prompts from "prompts";
import { exitOnCancel as onCancel } from "../utils/exitOnCancel";

export async function localPrompt() {
  const { saveTo } = await prompts(
    {
      name: "saveTo",
      message: "Where do you want to save the backups? (full path)",
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

  return { saveTo };
}
