import { MyContext } from "../types.ts";
import { getGPTResponse } from "../api/gptApi.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

// Интерфейс для структуры ответа GPT
interface GPTMoviesResponse {
  [key: string]: string;
}

// New truncate function
function truncateTextExact(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "…" : text;
}

// Хэндлер для начала взаимодействия
async function byDescriptionHandler(ctx: MyContext) {
  ctx.session.waitingForDescription = true;
  ctx.session.waitingForGenres = false;
  ctx.session.waitingForActors = false;
  await ctx.reply(
    "Please provide the movie description (example - Funny, sad and lifechanging, etc.):"
  );
}

// Хэндлер для обработки введенного описания
async function handleDescriptionInput(ctx: MyContext) {
  if (ctx.session.waitingForDescription) {
    const userMessage = ctx.message?.text;

    if (!userMessage) {
      await ctx.reply("Please provide a valid input.");
      return;
    }

    console.log(`[DESC] User ${ctx.from?.username || ctx.from?.id}'s input:`, userMessage); // Log user input

    await ctx.reply("📖 Got it! Analyzing your description to find the best matches for you. Hang tight! 😊");

    try {
      // Получение ответа от GPT
      const gptResponse = (await getGPTResponse(
        `You have to provide movies (not series) list (just english titles, in json format but without '''json, example - '{
          "1": "Fight Club",
          "2": "Seven",
          "3": "Inglourious Basterds",
          "4": "Once Upon a Time in Hollywood",
          "5": "Ocean's Eleven"
        }', max - 5) by description: '${userMessage}'. 
        YOU HAVE TO REMEMBER: If you think it's invalid or inappropriate description just send {}.`
      )) as string; // Приводим к типу string

      // Парсим JSON-ответ
      const movies: GPTMoviesResponse = JSON.parse(gptResponse);
      const movieTitles = Object.values(movies);

      // Если фильмов нет
      if (movieTitles.length === 0) {
        await ctx.reply("No valid description found in the input.");
      } else {
        // Генерация клавиатуры
        const keyboard = new InlineKeyboard();
        
        movieTitles.forEach((title) => {
          const truncatedTitle = truncateTextExact(title, 33); // Use new truncate function
          const encodedTitle = encodeURIComponent(truncatedTitle);
          keyboard.text(truncatedTitle, `movie_${encodedTitle}`).row();
        });

        // Отправка сообщения с клавиатурой
        await ctx.reply(`Movies found:`, { reply_markup: keyboard });
      }
    } catch (error) {
      console.error("Error communicating with GPT API:", error);
      await ctx.reply("Sorry, there was an error processing your request.");
    }

    ctx.session.waitingForDescription = false;
  }
}

// Экспортируем хэндлеры
export { byDescriptionHandler, handleDescriptionInput, truncateTextExact };
