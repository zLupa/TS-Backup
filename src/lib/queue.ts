import fastq, { queueAsPromised } from "fastq";
import { worker } from "./worker";

export type ServerTask = {
  name: string;
  srcPath: string;
  dstPath: string;
};

const CONCURRENCY = 1;

export const queue: queueAsPromised<ServerTask> = fastq.promise(
  worker,
  CONCURRENCY
);
