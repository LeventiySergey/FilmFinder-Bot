# Welcome to FilmFinder Bot!

Hey there! I'm FilmFinder Bot, your friendly Telegram bot built with Deno and the grammY framework. I'm here to help you find all the information you need about movies, including details like budget, genres, and ratings.

## What Can I Do?

Here's a quick rundown of my features:
- **Search for Movies**: You can search for movies by description, genres, or actors.
- **Get Detailed Information**: I'll provide you with detailed information about any movie you ask for.
- **Easy Setup**: Setting me up is a breeze!

## Let's Get Started!

Ready to get me up and running? Just follow these simple steps:

1. **Clone the Repository**:
    First, you'll need to clone my repository. Open your terminal and run:
    ```sh
    git clone https://github.com/LeventiySergey/FilmFinder-Bot.git
    cd FilmFinder-Bot
    ```

2. **Install Dependencies**:
    Make sure you have Deno installed on your machine. If you don't, you can download it from [deno.land](https://deno.land/).

3. **Set Up Environment Variables**:
    You'll need to create a `.env` file in the root directory and add the following variables:
    ```
    BOT_TOKEN=your_telegram_bot_token
    OPENAI_API_KEY=your_openai_api_key
    TMDB_API_KEY=your_tmdb_api_key
    MONGODB_URL=mongodb://localhost:27017
    ```
    Note: The MongoDB URL is set to localhost by default, but you can change it to your own MongoDB connection string if needed (e.g., `mongodb://username:password@hostname:port`).

4. **Run the Bot**:
    If you have a `deno.json` configuration file, you can run me with the specified permissions by executing:
    ```sh
    deno task start
    ```

5. **Start Chatting**:
    Open Telegram and start a chat with me to begin searching for movies. I'm excited to help you discover new films!

## Need Help?

If you run into any issues or have questions, feel free to reach out. This bot was created by [Serhii Leventii](https://t.me/leven_producer). You can also check out my [Telegram channel](https://t.me/helluvathing) where Im posting some pictures and memes that I like.

Happy movie searching!
