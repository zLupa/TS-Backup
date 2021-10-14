<p>
  <h1 align="center">⚙️ Configuração</h1>
</p>

O arquivo `config.json` especifica algumas configurações necessárias para a aplicação executar como esperado.

A propriedade `backupPath` irá especificar onde os Backups irão ser salvos (pasta).
Você pode acessar as pastas pelo comando `cd` do Linux.  
Exemplos: `/root/backups`, `/backups`, `/home/my_user/backups`

A propriedade `servers` irá especificar os servidores (ou pastas) que a aplicação irá fazer Backup.

A propriedade `name` irá especificar o nome do servidor.  
A propriedade `path` irá especificar o caminho da pasta.  
Exemplos:

Irá fazer Backup de um servidor chamado `BungeeCord` na pasta `/root/bungeecord`.

```json
{
  "name": "BungeeCord",
  "path": "/root/bungeecord"
}
```

Irá fazer Backup de um servidor chamado `Rankup` na pasta `/root/rankup`.

```json
{
  "name": "Rankup",
  "path": "/root/rankup"
}
```

Exemplo de um arquivo completo:

Irá salvar os Backups na pasta `/backups`.  
Irá fazer Backup de um servidor chamado `BungeeCord` onde está localizado em `/var/lib/pterodactyl/servers/a123-asdaw-123ad1-a1sd1`.  
Irá fazer Backup de um servidor chamado `Rankup` onde está localizado em `/root/rankup`

```json
{
  "backupPath": "/backups",
  "servers": [
    {
      "name": "BungeeCord",
      "path": "/var/lib/pterodactyl/servers/a123-asdaw-123ad1-a1sd1"
    },
    {
      "name": "Rankup",
      "path": "/root/rankup"
    }
  ]
}
```

## 📝 Contato

Se você tiver alguma dúvida ou problema abra uma issue no repositório ou me contate pelo Discord: `Lupa 🎃#2348`
