import { constants } from "fs";
import { access } from "fs/promises";
import prompts from "prompts";
import {
  getGoogleDriveClient,
  listGoogleDriveFiles,
} from "../../lib/drive/googleDriveWorker";
import { exitOnCancel as onCancel } from "../utils/exitOnCancel";

export async function googleDrivePrompt() {
  const { serviceAccountFilePath } = await prompts(
    {
      name: "serviceAccountFilePath",
      message: "Where's your service account file?",
      min: 1,
      type: "text",
      validate: async input => {
        try {
          await access(input, constants.R_OK);
          return true;
        } catch (error) {
          return "I don't have permission to view this file or it doesn't exists!";
        }
      },
    },
    { onCancel }
  );

  const client = getGoogleDriveClient(serviceAccountFilePath);
  const folders = await listGoogleDriveFiles("only-folders", client);

  const { folderId } = await prompts({
    name: "folderId",
    message:
      "Do you want store the backups in a specific folder inside Google Drive? (Press ESC to none)",
    type: folders?.length > 0 ? "select" : null,
    choices: [
      ...folders.map(folder => ({
        title: folder.name as string,
        value: folder.id as string,
      })),
    ],
  });

  return { serviceAccountFilePath, folderId };
}
