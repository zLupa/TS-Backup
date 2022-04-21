import fastq, { queueAsPromised } from "fastq";
import { driveWorker } from "./googleDriveWorker";

export type DriveTask = {
  name: string;
  srcPath: string;
};
const CONCURRENCY = 1;

export const driveQueue: queueAsPromised<DriveTask> = fastq.promise(
  driveWorker,
  CONCURRENCY
);
