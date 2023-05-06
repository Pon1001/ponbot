import { SlashCommandBuilder } from "discord.js";


export const command = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Message from Pon.")

export async function execute() {
    return "ponponpon!!!!!!"
}
