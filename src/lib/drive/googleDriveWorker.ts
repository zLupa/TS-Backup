import { auth, drive, drive_v3 } from "@googleapis/drive";
import { Readable, PassThrough } from "stream";
import tar from "tar";
import { getConfig } from "../../config/config";
import { DriveTask } from "./googleDriveQueue";

interface IUploadFile {
  name: string;
  parent?: string;
  fileStream: Readable;
  client?: drive_v3.Drive;
}

export function getGoogleDriveClient(serviceAccountFilePath?: string) {
  if (!serviceAccountFilePath) {
    serviceAccountFilePath = getConfig().drive?.serviceAccountFilePath;
  }

  const authClient = new auth.GoogleAuth({
    keyFile: serviceAccountFilePath,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return drive({ version: "v3", auth: authClient });
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
