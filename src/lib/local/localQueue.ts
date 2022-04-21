import fastq, { queueAsPromised } from "fastq";
import { localWorker } from "./localWorker";

export type FolderTask = {
  name: string;
  srcPath: string;
  dstPath: string;
};

const CONCURRENCY = 1;

export const localQueue: queueAsPromised<FolderTask> = fastq.promise(
  localWorker,
  CONCURRENCY
);
