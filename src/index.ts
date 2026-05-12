import { Spectrum } from "spectrum-ts";
import { terminal } from "spectrum-ts/providers/terminal";
import { imessage } from "spectrum-ts/providers/imessage";
import { config } from "./config/env.js";
import { processHealthMessage } from "./ai/triage.js";
import { formatResponse } from "./utils/responseFormatter.js";
import { startIMessageService } from "./services/imessageService.js";

async function main() {
  /* 
  // Start Advanced iMessage Service (Disabled in favor of Spectrum Provider)
  startIMessageService().catch(err => {
    console.error("❌ iMessage Service Error:", err);
  });
  */

  const providers: any[] = [
    terminal.config(),
    imessage.config({
      local: config.imessage.local,
      ...(config.imessage.local
        ? {}
        : {
            clients: [
              {
                address: config.imessage.address.replace(/^https?:\/\//, ""),
                token: config.imessage.token,
                phone: config.imessage.phone,
              },
            ],
          }),
    }),
  ];

  const app = await Spectrum({
    projectId: config.photon.projectId,
    projectSecret: config.photon.projectSecret,
    providers,
  });

  console.log("🩺 MediChat AI Started");
  console.log("Listening for messages via Terminal and Advanced iMessage...\n");

  // Handle Terminal messages via Spectrum
  for await (const [space, message] of app.messages) {
    try {
      if (message.content.type !== "text") continue;

      const userText = message.content.text;
      const platform = message.sender.id.includes('@') || message.sender.id.includes(':') ? 'iMessage' : 'Terminal';
      console.log(`\n👤 ${platform}: ${userText}`);

      await space.responding(async () => {
        const aiResponse = await processHealthMessage(
          message.sender.id,
          userText
        );

        const formattedResponse = formatResponse(aiResponse || "I'm sorry, I couldn't generate a response.");
        
        await message.reply(formattedResponse);
        console.log(`\n🤖 AI: ${aiResponse}`);
      });

    } catch (error) {
      console.error("Error processing message:", error);
      await message.reply(
        formatResponse("I'm sorry, something went wrong. Please try again.")
      );
    }
  }
}

main().catch((error) => {
  console.error("Fatal Error:", error);
  process.exit(1);
});

