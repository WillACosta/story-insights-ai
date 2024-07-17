import type { NextApiRequest, NextApiResponse } from "next";
import { ExecutionStatusResponse } from "./types";

type ResponseData = {
  message: string;
};

type GetTokenResponseData = {
  access_token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  function getToken(): Promise<GetTokenResponseData> {
    return fetch(
      "https://idm.stackspot.com/stackspot-freemium/oidc/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: `${process.env.CLIENT_ID}`,
          client_secret: `${process.env.CLIENT_SECRET}`,
          grant_type: "client_credentials",
        }),
      }
    ).then((response) => response.json());
  }

  /// Request a new execution for the quick command and returns the current execution id
  function createExecution(token: string, data: string): Promise<string> {
    return fetch(
      "https://genai-code-buddy-api.stackspot.com/v1/quick-commands/create-execution/story-insights-ai",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_data: data,
        }),
      }
    ).then((response) => response.json());
  }

  function getExecutionStatus(
    token: string,
    executionId: string
  ): Promise<ExecutionStatusResponse> {
    return fetch(
      `https://genai-code-buddy-api.stackspot.com/v1/quick-commands/callback/${executionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => response.json());
  }

  const { promptMessage } = JSON.parse(req.body);

  const token = await getToken();
  const executionId = await createExecution(token.access_token, promptMessage);

  let executionStatus: ExecutionStatusResponse;

  while (true) {
    executionStatus = await getExecutionStatus(token.access_token, executionId);

    if (executionStatus.steps != null) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  res
    .status(200)
    .json({ message: executionStatus.steps![0].step_result.answer });
}
