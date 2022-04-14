#!/usr/bin/env node
import { version } from "../../package.json";

import { program } from "commander";
import { runAddFolder } from "./add";
import { runInit } from "./init";

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
  .command("add")
  .description("Add new folder to make backup")
  .action(async () => {
    await runAddFolder();
  });

program
  .command("init")
  .description("Initiate the application with basic configuration")
  .action(async () => {
    await runInit();
  });
program.parse();
