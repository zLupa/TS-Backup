import { execSync } from "child_process";

const host = process.env.MARIADB_HOST;
const port = process.env.MARIADB_PORT;
const username = process.env.MARIADB_USERNAME;
const password = process.env.MARIADB_PASSWORD;

export function mysqlBackup(dstPath: string) {
  let command;

  if (password == "") {
    command = `mysqldump -u ${username} -h ${host} --port ${port} --all-databases > ${dstPath}/mysqlBackup.db`;
  } else {
    command = `mysqldump -u ${username} -p${password} -h ${host} --port ${port} --all-databases > ${dstPath}/mysqlBackup.db`;
  }

  execSync(command);

  return;
}
