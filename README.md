# Definitely Not Rhythm Bot (DNRB)

A discord bot that joins your channel and plays audio on request.

# Installation

From terminal, clone repository:

    git clone https://github.com/johnentrieri/dnrb.git

Navigate to cloned repository and install needed packages using [NodeJS/NPM](https://nodejs.org/en):

    npm install

## Setup

1. In the root directory of the repository, copy the **TEMPLATE.env** file to a new file named **.env**

2. Go to [Download FFmpeg](https://ffmpeg.org/download.html) to download *ffmpeg (full)* binaries for your Windows/Linux distribution and ensure the binaries are [added to the PATH environment variable](https://www.java.com/en/download/help/path.html).

3. Create a Discord application from the [Discord Developer Portal](https://discord.com/developers/applications) and use Bot Settings option to Build-A-Bot.

4. Copy the Application ID from the General Information tab and paste into the **.env** file replacing **DISCORD-APPLICATION-ID**

5. Copy the generated Bot Token and paste into the **.env** file replacing **DISCORD-BOT-TOKEN**

6. *Development Only:* Open up the Discord Client (ensure Developer Mode is enabled), right click the server that the application will be registered for, Copy ID and paste into  the **.env** file replacing **DISCORD-CHANNEL-ID**

## Deploying Commands

All commands within the /commands/ directory can be deployed to the development server by running the following:

    node deploy-commands.js
    
This must be re-run whenever new commands are added/removed.

Arguments to applicationGuildCommands() function can be modified to either deploy commands to a specific Guild/Channel or to all Channels where the Bot is added - See [Discord.js Guide](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration)

## Running the Bot

To run the Bot, use the following command:

    node index.js


## Commands
|Command         |Functionality/Response
|----------------|-----------------------------------------------------------------------------------------------------------------------|
|`/ping`         |Replies with "Pong" *([Discord.js Guide](https://discordjs.guide/creating-your-bot/slash-commands.html))*              |
|`/user`         |Replies with User information *([Discord.js Guide](https://discordjs.guide/creating-your-bot/slash-commands.html))*    |
|`/server`       |Replies with Server information *([Discord.js Guide](https://discordjs.guide/creating-your-bot/slash-commands.html))*  |
|`/summon`       |Summons DNRB to the Voice Channel of the summoning User                                                                |
|`/banish`       |Banishes DNRB from the Voice Channel of the summoning User                                                             |
|`/carl`         |Summons DNRB to the summoning User's Voice Channel, Plays the test sound *carl.mp3*, and leaves the Channel            |
|`/play [query]` |Searches for a song using keyword **query**, downloads the top result as an MP3 locally, and plays it on the Voice     |