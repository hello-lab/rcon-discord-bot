
# 🎮 CS:GO Discord RCON Bot

A powerful Discord bot for managing CS:GO servers remotely using RCON commands.  
Built with Node.js and Discord.js, featuring command handling, AI-powered help, and server control — including auto-restart on system errors via `systemd`.

---

## 📦 Features

- ✅ Slash commands for CS:GO server management via RCON  
- ✅ AI assistant to suggest and correct CS:GO/SourceMod commands using Gemini API  
- ✅ Countdown timers, embedded messages, and dynamic updates  
- ✅ Auto-restart on crash using **systemd service**  
- ✅ Logs and environment variable support  

---

## 🚀 Setup

### 1️⃣ Install Dependencies

```bash
npm install
````

---

### 2️⃣ Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your-google-genai-key
DISCORD_TOKEN=your-discord-bot-token

```

---

### 3️⃣ Run Locally (Dev)

```bash
node main.js
```

Or with `nodemon`:

```bash
npx nodemon main.js
```

---

## 🔄 Auto-Restart with `systemd`

### 📁 Example Directory Structure:

```
/home/youruser/csgo-discord-bot/
├── index.js
├── package.json
├── .env
└── ...
```

---

### 📜 Create a Systemd Service

```bash
sudo nano /etc/systemd/system/csgo-discord-bot.service
```

**Paste this config:**

```ini
[Unit]
Description=CSGO Discord Bot
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/youruser/csgo-discord-bot
ExecStart=/usr/bin/node /home/youruser/csgo-discord-bot/main.js
Restart=always
RestartSec=5
EnvironmentFile=/home/youruser/csgo-discord-bot/.env
StandardOutput=append:/home/youruser/csgo-discord-bot/bot.log
StandardError=append:/home/youruser/csgo-discord-bot/error.log
User=youruser
Group=youruser

[Install]
WantedBy=multi-user.target
```

---

### 🔄 Start and Enable Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable csgo-discord-bot
sudo systemctl start csgo-discord-bot
```

---

### 🔍 Check Status & Logs

```bash
sudo systemctl status csgo-discord-bot
sudo journalctl -u csgo-discord-bot -f
```

---

## 📖 Commands Available

* `/su` – Allows people to run the command
* `!rcon <command>` – Send an RCON command to your server


---

## 📸 Images
### Giving su privilleges to other users
![image](https://github.com/user-attachments/assets/e5901f32-a338-415a-a964-9612173ceadc)
### Running status command
![image](https://github.com/user-attachments/assets/233e9d5d-ab15-4fc0-b687-b9dd21e2685a)
### AI suggestion for invalid command
![image](https://github.com/user-attachments/assets/e9663867-cfc8-45c6-8ff6-057e23f6f584)

## 💾 Tech Stack

* Node.js
* Discord.js
* RCON-SRCDS
* Google Gemini API
* systemd (for process management)

---


