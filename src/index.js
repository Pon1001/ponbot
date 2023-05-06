import { Client, GatewayIntentBits } from "discord.js"
import { Logger } from "tslog"
import fs from "fs/promises"
import { config } from "dotenv"

config()

const logger = new Logger()

const client = new Client({
    intents: Object.values(GatewayIntentBits)
})

client.on("ready", async () => {
    let modules = await fs.readdir("./src/commands")
    let imported = await Promise.all(modules.map(mo => import(`./commands/${mo}`)))
    let cmds = imported.map(({command}) => command.toJSON())

    await Promise.all(client.guilds.cache.map(guild => guild.commands.set(cmds)))
})

client.on("interactionCreate", async interaction => {
    if(interaction.isCommand()) {
        let {execute} = await import(`./commands/${interaction.commandName}.js`)
        interaction.reply(await execute(...interaction.options.data) || "コマンドエラー： NIAMEY - LEE")
    } else return;
})
client.on("debug", logger.info.bind(logger))
client.on("error", logger.error.bind(logger))
client.on("warn", logger.warn.bind(logger))

await client.login()