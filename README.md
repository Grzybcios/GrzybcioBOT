# 🎵 Grzybcio BOT

**Grzybcio BOT** to automatyczny bot Discord, który o określonej godzinie dołącza do wybranego kanału głosowego, odtwarza muzykę i wychodzi po zakończeniu.  
Działa **tylko na jednym serwerze**, którego ID podasz w `config.json`.

---

## ⚙️ Konfiguracja

Edytuj plik `config.json`:

```json
{
  "token": "TWÓJ_TOKEN_BOTA",
  "guildId": "123456789012345678",
  "audioFile": "./muzyka.mp3",
  "hour": 21,
  "minute": 37,
  "voiceChannelName": "2137"
}

```
🔸 Opis pól:

    token – token Twojego bota z Discord Developer Portal

    guildId – ID serwera, na którym bot ma działać (kliknij PPM na serwerze → „Kopiuj ID”)

    audioFile – ścieżka do pliku muzycznego (.mp3, .wav, .ogg)

    hour / minute – godzina, o której bot ma zagrać (24h format)

    voiceChannelName – nazwa kanału głosowego, do którego ma dołączyć

🔸 Instalacja
🔸 Zainstaluj Node.js (18+)

    Na Windows:
    👉 https://nodejs.org

    Na Linux (Debian/Ubuntu):

    sudo apt update
    sudo apt install -y nodejs npm

🔸 Zainstaluj zależności

    npm install

🔸 Uruchom bota

    node index.js

🔸 FFmpeg

    Bot używa ffmpeg-static, więc nie wymaga ręcznej instalacji FFmpeg.
    Jeśli zobaczysz błąd „FFmpeg not found”, oznacza to, że hosting blokuje binarkę.
    Wtedy możesz:

    skontaktować się z administratorem hostingu,

    lub zainstalować FFmpeg lokalnie w PATH.

🔸 Logi w konsoli

    Bot informuje o:

    godzinie startu,

    serwerze i kanale,


    błędach i zakończeniu odtwarzania.
