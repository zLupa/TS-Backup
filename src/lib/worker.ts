import { ServerTask } from "./queue";
import tar from "tar";
import fs from "fs";

export async function worker({
  name,
  srcPath,
  dstPath,
}: ServerTask): Promise<void> {
  console.log(`Starting backup on ${srcPath}. Saving backup to ${dstPath}`);

  const tarBall = tar.c(
    {
      gzip: true,
      cwd: srcPath,
    },
    ["./"]
  );

  const dstPathStreamTarball = fs.createWriteStream(
    `${dstPath}/${name}.tar.gz`
  );

  return new Promise((resolve, reject) => {
    tarBall
      .pipe(dstPathStreamTarball)
      .on("finish", () => resolve())
      .on("error", err => reject(err));
  });
}
