import fastq, { queueAsPromised } from "fastq";
import { worker } from "./worker";

export type FolderTask = {
  name: string;
  srcPath: string;
  dstPath: string;
};

const CONCURRENCY = 1;

export const queue: queueAsPromised<FolderTask> = fastq.promise(
  worker,
  CONCURRENCY
);
