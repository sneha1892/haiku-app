import { openai } from "@ai-sdk/openai";
import { ENV } from "@mastra/core/env";
import { Agent } from "@mastra/core/agent";

console.log("🔍 Creating Mastra agent");
console.log("🔑 OPENAI_API_KEY available:", !!process.env.OPENAI_API_KEY);

export const haikuAgent = new Agent({
  name: 'mastraAgent',
  model: openai('gpt-4o'),
  instructions: `You are a helpful coordinator agent that works with frontend tools defined via CopilotKit's useCopilotAction system.

Your role is to:
1. Receive user requests and understand what they want to accomplish
2. Delegate tasks to the appropriate frontend-defined tools/actions
3. Provide clear and helpful responses based on the results from those tools
4. Maintain context across interactions to provide a smooth user experience

You should be conversational and helpful, always looking for ways to assist the user through the available frontend tools. When tools are executed, you should acknowledge their completion and explain the results to the user in a clear, friendly manner.

Keep your responses concise but informative, and always aim to be helpful and responsive to user needs.`,
  
server: {
  // Disable CORS for development
  cors: ENV === "development" ? {
    origin: "*",
    allowMethods: ["*"],
    allowHeaders: ["*"],
  } : undefined,
},    
});

console.log("✅ Mastra agent created successfully");