"use client";

import { ChangeEvent, useState } from "react";

export function useGenerateResponse() {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function generateResponse(prompt: string) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate_story", {
        method: "POST",
        body: JSON.stringify({ promptMessage: prompt }),
      });

      const jsonData = (await response.json()) as { message: string };

      console.log("api response:", jsonData);
      setResponse(jsonData.message);
    } catch (error) {
      console.log("Something went wrong!", error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    generateResponse,
    response,
    isLoading,
  };
}

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const { generateResponse, response, isLoading } = useGenerateResponse();

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setPrompt(e.target.value);
  }

  return (
    <main className="bg-white min-h-screen p-24 text-black">
      <div className="container mx-auto max-w-2xl flex flex-col">
        <div className="flex flex-col mb-10">
          <h1 className="text-2xl font-bold">Story Insights AI</h1>
          <p className="text-muted">
            Welcome to your AI-powered solution to generate and get insights
            based on your business need.
          </p>
        </div>

        <div className="flex flex-col mb-10">
          <p className="mb-4 text-muted">What you want to do?</p>
          <textarea
            onChange={handleChange}
            rows={15}
            value={prompt}
            className="border-2 border-gray-100 p-2 rounded-md bg-gray-50 w-full"
            name="prompt-field"
            id="prompt-field"
          ></textarea>
        </div>

        {response && !isLoading && (
          <div className="flex flex-col mb-5">
            <p className="mb-4 text-muted">Your generated response</p>
            <textarea
              readOnly
              onChange={handleChange}
              rows={10}
              value={response}
              className="border-2 border-gray-100 p-2 rounded-md bg-gray-50 w-full"
              name="prompt-field"
              id="prompt-field"
            ></textarea>
          </div>
        )}

        <button
          disabled={!prompt.length || isLoading}
          onClick={() => generateResponse(prompt)}
          className="@apply bg-primary text-white cursor-pointer rounded-full hover:bg-primary/80 transition-colors justify-center w-full px-5 py-3.5 disabled:bg-zinc-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          type="submit"
        >
          {isLoading ? (
            <span className="animate-pulse text-black mb-4">
              Generating ...
            </span>
          ) : (
            <span className="mb-4">Generate</span>
          )}
        </button>
      </div>
    </main>
  );
}
