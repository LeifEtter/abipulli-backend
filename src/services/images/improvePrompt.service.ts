import { GPT_4o_COST } from "src/constants";
import { ApiError } from "src/error/ApiError";
import { logger } from "src/lib/logger";

export const requestImprovedPrompt = async (
  oldPrompt: string
): Promise<{ prompt: string; cost: number }> => {
  const res = await fetch(process.env.OPENAI_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAPI_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAPI_MODEL,
      input: oldPrompt,
    }),
  });
  if (!res.ok) {
    logger.error(await res.text());
    throw ApiError.internal({
      errorInfo: {
        msg: "Issue getting prompt from GPT API",
        code: 51,
      },
    });
  }
  const body = await res.json();
  const improvedPrompt: string | undefined =
    body["output"][0]["content"][0]["text"];

  if (improvedPrompt == undefined || improvedPrompt == "") {
    logger.error(body);
    throw ApiError.internal({
      errorInfo: {
        msg: "Issue getting prompt from GPT API",
        code: 51,
      },
    });
  }
  const cost: number = body["usage"]["total_tokens"] * GPT_4o_COST;
  return { prompt: improvedPrompt, cost };
};
