const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} = require("discord.js");
const BotUtils = require("./Utils");

module.exports = class extends Client {
  constructor(
    options = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],

      partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
      ],

      allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: true,
      },
      presence: {
        activities: [
          {
            name: process.env.STATUS,
            type: ActivityType[process.env.STATUS_TYPE],
          },
        ],
        status: PresenceUpdateStatus.DoNotDisturb,
      },
    }
  ) {
    super({ ...options });
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.slashArray = [];

    this.utils = new BotUtils(this);

    this.start();
  }

  async start() {
    await this.loadHandlers();
    await this.loadEvents();
    await this.loadCommands();
    await this.loadSlashCommands();

    this.login(process.env.BOT_TOKEN);
  }

  async loadCommands() {
    console.log(`-----------------------------------------`.yellow);
    console.log(`(${process.env.PREFIX})Cargando comandos`.yellow);
    await this.commands.clear();

    const RUTA_ARCHIVOS = this.utils.loadFiles("/src/Commands");

    if (RUTA_ARCHIVOS.length) {
      RUTA_ARCHIVOS.forEach((rutaArchivo) => {
        try {
          const COMMAND = require(rutaArchivo);
          const COMMAND_NAME = rutaArchivo
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];
          COMMAND.NAME = COMMAND_NAME;

          if (COMMAND_NAME) this.Commands.set(COMMAND_NAME, COMMAND);
        } catch (e) {
          console.log(`Error al cargar el archivo ${rutaArchivo}`.bgRed);
          console.log(e);
        }
      });
    }
    console.log(
      `(${process.env.PREFIX}) ${this.commands.size}Comandos cargados`.green
    );
  }

  async loadSlashCommands() {
    console.log(`-----------------------------------------`.yellow);
    console.log(`(/)Cargando comandos slash` .yellow);
    await this.slashCommands.clear();
    this.slashArray = [];

    const RUTA_ARCHIVOS = this.utils.loadFiles("/src/slashCommands");

    if (RUTA_ARCHIVOS.length) {
      RUTA_ARCHIVOS.forEach((rutaArchivo) => {
        try {
          const COMMAND = require(rutaArchivo);
          const COMMAND_NAME = rutaArchivo
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];
          COMMAND.CMD.name = COMMAND_NAME;

          if (COMMAND_NAME) this.slashCommands.set(COMMAND_NAME, COMMAND);
          this.slashArray.push(COMMAND.CMD.toJSON());
        } catch (e) {
          console.log(`Error al cargar el archivo ${rutaArchivo}`.bgRed);
          console.log(e);
        }
      });
    }
    console.log(`(/) ${this.slashCommands.size}Comandos cargados`.green);

    if (this?.application?.commands) {
      this.application.commands.set(this.slashArray);
      console.log(`(/) ${this.slashCommands.size} Comandos publicados`.green);
    }
  }

  async loadHandlers() {
    console.log(`-----------------------------------------`.yellow);
    console.log(`(-)Cargando Handlers`.yellow);

    const RUTA_ARCHIVOS = this.utils.loadFiles("/src/handlers");

    if (RUTA_ARCHIVOS.length) {
      RUTA_ARCHIVOS.forEach((rutaArchivo) => {
        try {
          require(rutaArchivo)(this);

        } catch (e) {
          console.log(`Error al cargar el archivo ${rutaArchivo}`.bgRed);
          console.log(e);
        }
      });
    }
    console.log(`(-) ${RUTA_ARCHIVOS.length}Handlers cargados`.green);
  }

  async loadEvents() {
    console.log(`-----------------------------------------`.yellow);
    console.log(`(+)Cargando eventos`.yellow);
    this.removeAllListeners();

    const RUTA_ARCHIVOS = this.utils.loadFiles("/src/events");

    if (RUTA_ARCHIVOS.length) {
      RUTA_ARCHIVOS.forEach((rutaArchivo) => {
        try {
          const EVENT = require(rutaArchivo);
          const EVENT_NAME = rutaArchivo
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];
          this.on(EVENT_NAME, EVENT.bind(null, this));

          if (COMMAND_NAME) this.commands.set(COMMAND_NAME, COMMAND);
        } catch (e) {
          console.log(`Error al cargar el archivo ${rutaArchivo}`.bgRed);
          console.log(e);
        }
      });
    }
    console.log(`(+) ${RUTA_ARCHIVOS.length}Eventos cargados`.green);
  }
};
