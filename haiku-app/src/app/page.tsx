"use client";
import { CopilotKit, useCopilotAction } from "@copilotkit/react-core";
import { CopilotKitCSSProperties, CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";
import "@copilotkit/react-ui/styles.css";

interface HaikuData {
  id: string;
  japanese: string[];
  english: string[];
  image: string;
  timestamp: Date;
}

// Simple list of available images
const availableImages = [
  'Bonsai_Tree_Potted_Japanese_Art_Green_Foliage.jpeg',
  'Cherry_Blossoms_Sakura_Night_View_City_Lights_Japan.jpg',
  'Ginkaku-ji_Silver_Pavilion_Kyoto_Japanese_Garden_Pond_Reflection.jpg',
  'Itsukushima_Shrine_Miyajima_Floating_Torii_Gate_Sunset_Long_Exposure.jpg',
  'Mount_Fuji_Lake_Reflection_Cherry_Blossoms_Sakura_Spring.jpg',
  'Osaka_Castle_Turret_Stone_Wall_Pine_Trees_Daytime.jpg',
  'Senso-ji_Temple_Asakusa_Cherry_Blossoms_Kimono_Umbrella.jpg',
  'Shirakawa-go_Gassho-zukuri_Thatched_Roof_Village_Aerial_View.jpg',
  'Takachiho_Gorge_Waterfall_River_Lush_Greenery_Japan.jpg',
  'Tokyo_Skyline_Night_Tokyo_Tower_Mount_Fuji_View.jpg'
];

export default function AgenticChat() {
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      showDevConsole={false}
      agent="haikuAgent"
    >
      <div
        className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-coral-50 to-orange-50"
        style={
          {
            "--copilot-kit-primary-color": "#ff6b6b",
            "--copilot-kit-separator-color": "#ffd1dc",
          } as CopilotKitCSSProperties
        }
      >
        <HaikuApp />
        <CopilotSidebar
          defaultOpen={true}
          labels={{
            title: "Haiku Generator 🌸",
            initial: "Welcome to the Haiku Garden! I can help you create beautiful haiku poems in Japanese and English. What would you like your haiku to be about?",
          }}
          clickOutsideToClose={false}
          className="haiku-chat-panel"
        />
      </div>
    </CopilotKit>
  );
}

function HaikuApp() {
  const [approvedHaikus, setApprovedHaikus] = useState<HaikuData[]>([]);
  const [currentHaiku, setCurrentHaiku] = useState<HaikuData>({
    id: 'default',
    japanese: ["仮の句よ", "まっさらながら", "花を呼ぶ"],
    english: [
      "A placeholder verse—",
      "even in a blank canvas,",
      "it beckons flowers.",
    ],
    image: '/haiku-images/Mount_Fuji_Lake_Reflection_Cherry_Blossoms_Sakura_Spring.jpg',
    timestamp: new Date()
  });

  useCopilotAction({
    name: "generateHaiku",
    description: `Generate a beautiful haiku in Japanese with English translation, and select the most appropriate image from these available options: ${availableImages.join(', ')}`,
    parameters: [
      {
        name: "japanese",
        type: "string[]",
        description: "An array of three lines of the haiku in Japanese (5-7-5 syllables)",
      },
      {
        name: "english",
        type: "string[]",
        description: "An array of three lines of the haiku in English translation",
      },
      {
        name: "selectedImage",
        type: "string",
        description: "Choose the most appropriate image filename from the available options based on the haiku content",
      },
    ],
    followUp: false,
    handler: async ({ japanese, english, selectedImage }) => {
      // Here you would make OpenAI API calls for haiku generation
      // const response = await fetch('/api/openai', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: userInput, type: 'haiku' })
      // });
      
      // Validate that the selected image exists in our list
      const imageExists = availableImages.includes(selectedImage);
      const finalImage = imageExists ? selectedImage : availableImages[0];
      
      return `Generated haiku with selected image: ${finalImage}`;
    },
    render: ({ args: generatedHaiku, result, status }) => {
      return (
        <HaikuApproval
          generatedHaiku={generatedHaiku}
          status={status}
          onApprove={(haiku) => {
            const newHaiku: HaikuData = {
              id: Date.now().toString(),
              japanese: haiku.japanese,
              english: haiku.english,
              image: `/haiku-images/${haiku.selectedImage || availableImages[0]}`,
              timestamp: new Date()
            };
            setApprovedHaikus(prev => [newHaiku, ...prev]);
            setCurrentHaiku(newHaiku);
          }}
          onReject={() => {
            console.log('Haiku rejected');
          }}
        />
      );
    },
  });

  return (
    <div className="flex h-screen">
      {/* Left Sidebar - Approved Haikus */}
      <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-pink-200 overflow-y-auto">
        <div className="p-6 border-b border-pink-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Haiku Garden</h2>
          <p className="text-sm text-gray-600">Your approved collection</p>
        </div>
        <div className="p-4 space-y-4">
          {approvedHaikus.map((haiku) => (
            <div
              key={haiku.id}
              onClick={() => setCurrentHaiku(haiku)}
              className="p-4 bg-gradient-to-r from-pink-50 to-coral-50 rounded-lg border border-pink-200 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="text-xs text-gray-500 mb-2">
                {haiku.timestamp.toLocaleDateString()}
              </div>
              <div className="space-y-1">
                {haiku.japanese.map((line, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-gray-800">{line}</p>
                    <p className="text-xs text-gray-600 italic">{haiku.english[index]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {approvedHaikus.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No approved haikus yet.</p>
              <p className="text-xs mt-1">Start chatting to create your first haiku!</p>
            </div>
          )}
        </div>
      </div>

      {/* Center Canvas - Current Haiku Display */}
      <div className="flex-1 flex items-center justify-center p-8">
        <HaikuDisplay haiku={currentHaiku} />
      </div>
    </div>
  );
}

// Inline HaikuDisplay component with elegant typography and image display
function HaikuDisplay({ haiku }: { haiku: HaikuData }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-pink-200">
        {/* Image Section */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={haiku.image}
            alt="Haiku illustration"
            className="w-full h-64 object-cover"
            onError={(e) => {
              // Fallback to a gradient background if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.className += ' bg-gradient-to-br from-pink-200 via-coral-200 to-orange-200 flex items-center justify-center';
                parent.innerHTML = '<div class="text-gray-600 text-lg">🌸</div>';
              }
            }}
          />
        </div>

        {/* Japanese Text */}
        <div className="mb-8 text-center">
          <div className="space-y-3">
            {haiku.japanese.map((line, index) => (
              <div key={index} className="relative">
                <p className="text-4xl font-light text-gray-800 leading-relaxed tracking-wide">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* English Translation */}
        <div className="text-center border-t border-pink-200 pt-8">
          <div className="space-y-2">
            {haiku.english.map((line, index) => (
              <p key={index} className="text-lg text-gray-600 italic font-light leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Haiku Approval Component with Approve/Reject buttons
interface HaikuApprovalProps {
  generatedHaiku: any;
  status: any;
  onApprove: (haiku: any) => void;
  onReject: () => void;
}

function HaikuApproval({ generatedHaiku, status, onApprove, onReject }: HaikuApprovalProps) {
  const [isProcessed, setIsProcessed] = useState(false);

  if (!generatedHaiku || !generatedHaiku.japanese || !generatedHaiku.japanese.length) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-pink-50 to-coral-50 rounded-xl p-6 mt-4 mb-4 border border-pink-200 shadow-lg">
      {/* Preview Image */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <img
          src={`/haiku-images/${generatedHaiku.selectedImage || availableImages[0]}`}
          alt="Haiku preview"
          className="w-full h-32 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.className += ' bg-gradient-to-br from-pink-200 to-coral-200 flex items-center justify-center h-32';
              parent.innerHTML = '<div class="text-gray-600 text-2xl">🌸</div>';
            }
          }}
        />
      </div>

      {/* Haiku Text */}
      <div className={status === "complete" ? "border-b border-pink-200 pb-4 mb-4" : ""}>
        <div className="space-y-3">
          {generatedHaiku.japanese?.map((line: string, index: number) => (
            <div key={index} className="space-y-1">
              <p className="text-xl font-medium text-gray-800">{line}</p>
              <p className="text-sm text-gray-600 italic pl-4">
                {generatedHaiku.english?.[index]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      {status === "complete" && !isProcessed && (
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              onReject();
              setIsProcessed(true);
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-lg transition-colors duration-200 border border-gray-300"
          >
            Reject
          </button>
          <button
            onClick={() => {
              onApprove(generatedHaiku);
              setIsProcessed(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-coral-500 hover:from-pink-600 hover:to-coral-600 text-white text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Approve & Add to Garden
          </button>
        </div>
      )}

      {isProcessed && (
        <div className="text-center py-2">
          <span className="text-sm text-gray-600 italic">
            {status === "complete" ? "✓ Processed" : "Processing..."}
          </span>
        </div>
      )}
    </div>
  );
}
