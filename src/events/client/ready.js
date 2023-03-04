module.exports = Client => {
    console.log(`sesion iniciada como ${Client.user.tag}`)

    if (Client?.application?.commands) {
        Client.application.commands.set(Client.slashArray);
        console.log(`(/) ${Client.slashCommands.size} Comandos publicados`.green);
      }
}