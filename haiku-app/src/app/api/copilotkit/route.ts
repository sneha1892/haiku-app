import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra";
import { NextRequest } from "next/server";

// Import your local agent
import { haikuAgent } from "@/mastra/agents";

export const POST = async (req: NextRequest) => {
  // Convert the Mastra agent to CopilotKit format
  const copilotAgent = MastraAgent.fromAgent(haikuAgent);

  const runtime = new CopilotRuntime({
    agents: [copilotAgent],
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};