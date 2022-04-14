// Sim, eu sei que instalar Discord.JS só pra isso é meio overkill, mas enfim dps eu faço minha implementação com Axios.
import { MessageEmbed, WebhookClient } from "discord.js";
import { getConfig } from "../config/config";

export class DiscordService {
  private client: WebhookClient;

  constructor() {
    const { discordWebhookUrl } = getConfig();

    this.client = new WebhookClient({ url: discordWebhookUrl });
  }

  async sendStartBackupMessage() {
    const embed = new MessageEmbed();
    embed
      .setTitle("💾 Backup iniciado!")
      .setDescription(`O Backup foi iniciado de seus arquivos.`)
      .setFooter("TS-Backup")
      .setTimestamp()
      .setColor("YELLOW");

    await this.client.send({ embeds: [embed] });
  }

  async sendBackupErrorMessage(backupName: string, err: any) {
    const embed = new MessageEmbed();
    embed
      .setTitle("⚠️ Erro a fazer Backup")
      .setDescription(
        `Oops! Erros acontecem, relatório do erro: \nNome: ${backupName}\nErro: \`\`${err}\`\`
        **Obs.: O Backup do resto dos servidores ainda continuará mesmo com esse erro.**
        `
      )
      .setFooter("TS-Backup")
      .setTimestamp()
      .setColor("RED");

    await this.client.send({
      content: "<@392478720578945034>",
      embeds: [embed],
    });
  }

  async sendBackupFinishedMessage() {
    const embed = new MessageEmbed();
    embed
      .setTitle("✅ Backup finalizado!")
      .setDescription("Yay! O Backup foi finalizado com sucesso")
      .setFooter("TS-Backup")
      .setTimestamp()
      .setColor("GREEN");

    await this.client.send({ embeds: [embed] });
  }
}
