declare namespace NodeJS {
  interface ProcessEnv {
    MARIADB_HOST: string;
    MARIADB_USERNAME: string;
    MARIADB_PORT: string;
    MARIADB_PASSWORD: string;

    DISCORD_WEBHOOK_URL: string;
  }
}
