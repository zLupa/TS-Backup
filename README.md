<p>
  <h1 align="center">TS-Backup</h1>
</p>

Sistema de Backup com notificações pelo Discord feito especificamente para fazer Backups de servidores do Pterodactyl (Também pode ser usado para fazer Backups de outras coisas) totalmente em Typescript.

## 💻 Tecnologias usadas

- [Typescript](https://www.typescriptlang.org/)
- [FastQ](https://www.npmjs.com/package/fastq)

## ⚙️ Configurações

A aplicação necessita de algumas configurações suas para iniciar.  
Para isso, vá para o diretório `config` e procure pelo arquivo `config.json` e preencha ele como quiser.

## 🚀 Iniciar

```bash
- Clone o repositório (git clone https://github.com/zLupa/TS-Backup)
- Execute `yarn` para baixar as dependências.
- Execute `yarn build` para compilar a aplicação.
- Execute `yarn start` para iniciar a aplicação.
```

**Obs.:** Se você não tiver o `Yarn` o processo será um pouco diferente:

```bash
- Clone o repositório (git clone https://github.com/zLupa/TS-Backup)
- Execute `npm install` para baixar as dependências.
- Execute `npm run build` para compilar a aplicação.
- Execute `npm run start` para iniciar a aplicação.
```

E por fim, a aplicação irá iniciar e os Backups estarão disponíveis no local onde você colocou no arquivo `config.json`.

Caso queira rodar Backups todos os dias, dê uma olhada em Cron Jobs!

## ⛓️ Variáveis de ambiente

Para iniciar esse projeto, você irá precisar configurar o `.env.example.`  
Renomeie o arquivo de `.env.example` para `.env` e configure como quiser.

## 📝 Contato

Se você tiver alguma dúvida ou problema abra uma issue no repositório ou me contate pelo Discord: `Lupa 🎃#2348`
