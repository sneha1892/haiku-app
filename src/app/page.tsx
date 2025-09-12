"use client";
import { CopilotKit, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";
import "@copilotkit/react-ui/styles.css";
import "./style.css";

export default function AgenticChat() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      showDevConsole={false}
      // agent lock to the relevant agent
      agent="haikuAgent"
    >
      <div
        className="min-h-full w-full flex items-center justify-center pr-96"
        style={
          {
            // "--copilot-kit-primary-color": "#222",
            // "--copilot-kit-separator-color": "#CCC",
          } as CopilotKitCSSProperties
        }
      >
        <Haiku />
        <CopilotSidebar
          defaultOpen={true}
          labels={{
            title: "Haiku Generator",
            initial: "I'm a haiku generator 👋. How can I help you?",
          }}
          clickOutsideToClose={false}
        />
      </div>
    </CopilotKit>
  );
}
