const GPT_API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = Deno.env.get("OPENAI_API_KEY")!; // Зчитуємо API-ключ із змінних середовища

/**
 * Функція для отримання відповіді від GPT API
 * @param prompt - Текстовий запит користувача
 * @returns Відповідь GPT
 */
export async function getGPTResponse(prompt: string): Promise<string> {
  try {
    // Відправка запиту до GPT API
    const response = await fetch(GPT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // або "gpt-4", якщо доступно
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200, // Обмеження токенів у відповіді
      }),
    });

    // Перевірка статусу відповіді
    if (!response.ok) {
      console.error("Error response from GPT API:", await response.text());
      throw new Error(`GPT API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim(); // Повертаємо текст відповіді GPT
  } catch (error) {
    console.error("Error communicating with GPT API:", error);
    throw new Error("Failed to fetch response from GPT API.");
  }
}
