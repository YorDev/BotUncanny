module.exports = async (Client, message) => {
    if(!interaction.guild || !message.channel || message.author.bot) return;

    if(content.message.startWith(process.env.PREFIX)) return;

    const COMMAND = client.commands.get(interaction?.commandName);

    if(COMMAND){
        if(COMMAND.OWNER){
            const owners = process.env.OWNER_IDS.split(" ");
            if(!owners.includes(interaction.user.id)) return interaction.reply({content: `❌ **No tienes los permisos suficientes para ejecutar este comando**`});
        }

        if(COMMAND.BOT_PERMISSIONS){
            if(!interaction.guild.members.me.permissions.has(COMMAND.BOT_PERMISSIONS)) return interaction.reply({content: `❌ **Necesito los siguientes permisos para ejecutar este comando**\n${COMMAND.BOT_PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`});
        }

        if(COMMAND.PERMISSIONS){
            if(!interaction.members.permissions.has(COMMAND.PERMISSIONS)) return interaction.reply({content: `❌ **Necesitas los siguientes permisos para ejecutar este comando**\n${COMMAND.PERMISSIONS.map(PERMISO => `\`${PERMISO}\``).join(", ")}`});
        }

        try {
            COMMAND. execute(client, interaction, "/")
        } catch (error) {
            interaction.reply({content: `**Error al ejecutar el comando.`})
        }
    }
}