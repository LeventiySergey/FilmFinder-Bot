
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function recommendationsHandler(ctx: Context) {
  await ctx.reply("Your personal recommendations.");
}

export {recommendationsHandler}