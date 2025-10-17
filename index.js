// Grzybcio BOT – automatyczny bot Discord (tylko dla jednego serwera)
// Discord.js v14 + @discordjs/voice + node-schedule + ffmpeg-static

const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  getVoiceConnection,
} = require("@discordjs/voice");
const schedule = require("node-schedule");
const ffmpeg = require("ffmpeg-static");
const fs = require("fs");
const path = require("path");

// Wczytaj konfigurację
const configPath = path.join(__dirname, "config.json");
if (!fs.existsSync(configPath)) {
  console.error("❌ Nie znaleziono pliku config.json!");
  process.exit(1);
}
const config = require(configPath);

// Utwórz klienta Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
});

// Logowanie gotowości
client.once("ready", () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
  console.log(`🕐 Zaplanowano odtwarzanie o ${config.hour}:${config.minute < 10 ? "0" + config.minute : config.minute}`);
  console.log(`🎧 Kanał głosowy: "${config.voiceChannelName}"`);
  console.log(`🎵 Plik audio: ${config.audioFile}`);
  console.log(`🏠 Serwer docelowy: ${config.guildId}`);
});

// Zaplanuj zadanie
schedule.scheduleJob({ hour: config.hour, minute: config.minute }, async () => {
  console.log("⏰ Godzina startu! Sprawdzanie serwera...");

  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) {
    console.error("❌ Bot nie znajduje się na serwerze o podanym GUILD ID.");
    return;
  }

  try {
    const voiceChannel = guild.channels.cache.find(
      (ch) => ch.name === config.voiceChannelName && ch.type === 2
    );
    if (!voiceChannel) {
      console.log(`⚠️ Nie znaleziono kanału "${config.voiceChannelName}" na serwerze ${guild.name}`);
      return;
    }

    console.log(`🎵 Dołączanie do kanału ${voiceChannel.name} na serwerze ${guild.name}`);
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    if (!fs.existsSync(config.audioFile)) {
      console.error(`❌ Nie znaleziono pliku audio: ${config.audioFile}`);
      connection.destroy();
      return;
    }

    const resource = createAudioResource(config.audioFile, {
      inlineVolume: true,
      ffmpegPath: ffmpeg,
    });

    const player = createAudioPlayer();
    connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      console.log(`✅ Zakończono odtwarzanie na serwerze ${guild.name}`);
      const conn = getVoiceConnection(guild.id);
      if (conn) conn.destroy();
    });

    player.on("error", (err) => {
      console.error(`❌ Błąd podczas odtwarzania: ${err.message}`);
      const conn = getVoiceConnection(guild.id);
      if (conn) conn.destroy();
    });
  } catch (err) {
    console.error(`❌ Błąd na serwerze ${config.guildId}:`, err.message);
  }
});

// Logowanie do Discorda
client.login(config.token).catch((err) => {
  console.error("❌ Nie udało się zalogować do Discorda:", err.message);
});
