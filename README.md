# FilmFinder Bot

FilmFinder Bot is a Telegram bot built with Deno and the grammY framework. It helps users find information about movies, including details like cast, crew, and ratings.

## Features

- Search for movies by title
- Get detailed information about movies
- Easy to set up and run

## Getting Started

To get started with FilmFinder Bot, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/FilmFinder-Bot.git
    cd FilmFinder-Bot
    ```

2. **Install dependencies**:
    Ensure you have Deno installed. You can download it from [deno.land](https://deno.land/).

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add your Telegram bot token:
    ```
    BOT_TOKEN=your_telegram_bot_token
    ```

4. **Run the bot using `deno.json`**:
    If you have a `deno.json` configuration file, you can run the bot with the specified permissions:
    ```sh
    deno task start
    ```

5. **Interact with the bot**:
    Open Telegram and start a chat with your bot to begin searching for movies.