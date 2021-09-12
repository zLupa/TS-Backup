// Sim, eu sei que instalar Discord.JS só pra isso é meio overkill, mas enfim dps eu faço minha implementação com Axios.
import { MessageEmbed, WebhookClient } from "discord.js";

export class DiscordService {
  private client: WebhookClient;

  constructor() {
    this.client = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });
  }

  async sendStartBackupMessage() {
    const embed = new MessageEmbed();
    embed
      .setTitle("💾 Backup iniciado!")
      .setDescription(`O Backup foi iniciado de todos os servidores e o MySQL.`)
      .setFooter("Heroes Backup")
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
      .setFooter("Heroes Backup")
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
      .setFooter("Heroes Backup")
      .setTimestamp()
      .setColor("GREEN");

    await this.client.send({ embeds: [embed] });
  }
}
