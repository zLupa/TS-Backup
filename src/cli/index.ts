#!/usr/bin/env node
import { version } from "../../package.json";

import { program } from "commander";
import { runAddFolder } from "./add";
import { runInit } from "./init";
import { addCron } from "./cron";
import { runBckcup } from "./runBckup";

console.log(`
████████╗███████╗      ██████╗  █████╗  ██████╗██╗  ██╗██╗   ██╗██████╗ 
╚══██╔══╝██╔════╝      ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██║   ██║██╔══██╗
   ██║   ███████╗█████╗██████╔╝███████║██║     █████╔╝ ██║   ██║██████╔╝
   ██║   ╚════██║╚════╝██╔══██╗██╔══██║██║     ██╔═██╗ ██║   ██║██╔═══╝ 
   ██║   ███████║      ██████╔╝██║  ██║╚██████╗██║  ██╗╚██████╔╝██║     
   ╚═╝   ╚══════╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     
                                                                        
`);

program.description("Do backups in the easy way").version(version);

program
  .command("run")
  .description("Run the backup")
  .action(async () => {
    await runBckcup();
  });

program
  .command("add")
  .description("Add new folder to make backup")
  .action(async () => {
    await runAddFolder();
  });

program
  .command("cron")
  .description("Run the backups in a scheduler")
  .action(async () => {
    await addCron(__filename);
  });

program
  .command("init")
  .description("Initiate the application with basic configuration")
  .action(async () => {
    await runInit();
  });
program.parse();
