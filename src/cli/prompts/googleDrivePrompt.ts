import prompts from "prompts";
import {
  getGoogleDriveClient,
  getGoogleOAuthClient,
  listGoogleDriveFiles,
} from "../../lib/drive/googleDriveWorker";
import { CodeChallengeMethod } from "google-auth-library";
import { exitOnCancel as onCancel } from "../utils/exitOnCancel";

export async function googleDrivePrompt() {
  const oauthClient = getGoogleOAuthClient(false);

  const { codeVerifier, codeChallenge } =
    await oauthClient.generateCodeVerifierAsync();

  const authURL = oauthClient.generateAuthUrl({
    access_type: "offline",
    code_challenge: codeChallenge,
    code_challenge_method: CodeChallengeMethod.S256,
    scope: ["https://www.googleapis.com/auth/drive"],
  });

  const { code } = await prompts(
    {
      name: "code",
      min: 1,
      message: `Open this URL in your favorite browser and paste the code here \n${authURL}\n`,
      type: "text",
    },
    { onCancel }
  );

  const { tokens: credentials } = await oauthClient.getToken({
    code,
    codeVerifier,
  });

  const client = getGoogleDriveClient(credentials);
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

  return { credentials, folderId };
}
