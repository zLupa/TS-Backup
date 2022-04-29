import { auth, drive, drive_v3 } from "@googleapis/drive";
import { Credentials } from "google-auth-library";
import { Readable, PassThrough } from "stream";
import tar from "tar";
import { getConfig, saveConfig } from "../../config/config";
import googleOAuthConfig from "../../config/googleOAuthConfig";
import { DriveTask } from "./googleDriveQueue";

interface IUploadFile {
  name: string;
  parent?: string;
  fileStream: Readable;
  client?: drive_v3.Drive;
}

export function getGoogleOAuthClient(autoRefreshAccessToken: boolean = true) {
  const oauthClient = new auth.OAuth2(
    googleOAuthConfig.client_id,
    googleOAuthConfig.client_secret,
    googleOAuthConfig.redirect_uri
  );

  if (autoRefreshAccessToken) {
    oauthClient.on("tokens", credentials => {
      const config = getConfig();

      if (!config.drive) return;

      config.drive.credentials = {
        ...credentials,
        refresh_token: config.drive.credentials.refresh_token,
      };

      saveConfig(config);
    });
  }

  return oauthClient;
}

export function getGoogleDriveClient(credentials?: Credentials) {
  if (!credentials) {
    credentials = getConfig().drive?.credentials || {};
  }

  const oauthClient = getGoogleOAuthClient();

  oauthClient.setCredentials(credentials);

  return drive({ version: "v3", auth: oauthClient });
}

export async function uploadGoogleDriveFile({
  fileStream,
  name,
  parent,
  client,
}: IUploadFile) {
  if (!client) {
    client = getGoogleDriveClient();
  }

  await client.files.create({
    requestBody: {
      name: `${name}.tar.gz`,
      parents: parent ? [parent] : undefined,
    },
    media: {
      mimeType: "application/gzip",
      body: fileStream,
    },
    fields: "id",
  });
}

export async function listGoogleDriveFiles(
  filters?: "only-folders",
  client?: drive_v3.Drive
): Promise<drive_v3.Schema$File[]> {
  if (!client) {
    client = getGoogleDriveClient();
  }

  const {
    data: { files },
  } = await client.files.list();

  if (!files) {
    throw new Error(
      "Failed to list Google Drive files! File object is undefined."
    );
  }

  if (filters) {
    return files.filter(
      file => file.mimeType === "application/vnd.google-apps.folder"
    );
  }

  return files;
}

export async function driveWorker({ name, srcPath }: DriveTask) {
  const folderId = getConfig().drive?.folderId;

  const tarBall = tar
    .c(
      {
        gzip: true,
        cwd: srcPath,
      },
      ["./"]
    )
    .pipe(new PassThrough());

  await uploadGoogleDriveFile({ fileStream: tarBall, name, parent: folderId });
}
