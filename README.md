# Definitely Not Rhythm Bot (DNRB)

A discord bot that joins your channel and plays audio from YouTube on request.

# Installation

From terminal, clone repository:

    git clone https://github.com/johnentrieri/dnrb.git

Navigate to cloned repository and install needed packages using [NodeJS/NPM](https://nodejs.org/en):

    npm install

## Setup

In the root directory of the repository, copy the **TEMPLATE.env** file to a new file named **.env**

Create a Discord application from the [Discord Developer Portal](https://discord.com/developers/applications) and use Bot Settings option to Build-A-Bot.

Copy the Application ID from the General Information tab and paste into the **.env** file replacing **DISCORD-APPLICATION-ID**

Copy the generated Bot Token and paste into the **.env** file replacing **DISCORD-BOT-TOKEN**

*Development Only:* Open up the Discord Client (ensure Developer Mode is enabled), right click the server that the application will be registered for, Copy ID and paste into  the **.env** file replacing **DISCORD-CHANNEL-ID**

## Deploying Commands

All commands within the /commands/ directory can be deployed to the development server by running the following:

    node deploy-commands.js
    
This must be re-run whenever commands are added/removed.

Arguments to applicationGuildCommands() function can be modified to either deploy commands to a specific Guild/Channel or to all Channels where the Bot is added - See [Discord.js Guide](https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration)

## Running the Bot

To run the Bot, use the following command:

    node index.js


## Commands
|Command         |Functionality/Response
|----------------|-------------------------------|
|`/ping`         |Bot replies with `PONG`        |
|                |                               |
|                |                               |
|                |                               |
|                |                               |