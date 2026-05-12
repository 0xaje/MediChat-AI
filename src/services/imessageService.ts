import { createClient } from "@photon-ai/advanced-imessage";
import { config } from "../config/env.js";
import { processHealthMessage } from "../ai/triage.js";
import { formatResponse } from "../utils/responseFormatter.js";
import fs from "fs/promises";
import path from "path";

const CURSOR_FILE = path.join(process.cwd(), "scratch/imessage_cursor.json");

async function loadSequence(): Promise<number | null> {
  try {
    const data = await fs.readFile(CURSOR_FILE, "utf-8");
    return JSON.parse(data).sequence;
  } catch {
    return null;
  }
}

async function saveSequence(sequence: number) {
  try {
    await fs.mkdir(path.dirname(CURSOR_FILE), { recursive: true });
    await fs.writeFile(CURSOR_FILE, JSON.stringify({ sequence }));
  } catch (error) {
    console.error("Error saving sequence:", error);
  }
}

export async function startIMessageService() {
  if (!config.imessage.address || !config.imessage.token) {
    console.warn("⚠️ iMessage credentials missing. Advanced iMessage service not started.");
    return;
  }

  const rawAddress = config.imessage.address;
  const address = rawAddress.replace(/^https?:\/\//, '');
  const useTls = rawAddress.startsWith('https://') || rawAddress.includes(':443');

  const im = createClient({
    address: address,
    token: config.imessage.token,
    tls: useTls,
  });

  console.log("✅ Advanced iMessage Service Connected");

  try {
    // 1. Catch up on missed messages using im.events.catchUp
    const lastSequence = await loadSequence();
    if (lastSequence !== null) {
      console.log(`📥 Checking for missed messages since sequence ${lastSequence}...`);
      for await (const event of im.events.catchUp(lastSequence)) {
        if (event.type === "message.received") {
          const { message, chatGuid } = event;
          if (!message.content.text || message.isFromMe) continue;
          await handleIncomingMessage(im, chatGuid, message.content.text);
          await saveSequence(event.sequence);
        }
      }
    }

    // 2. Subscribe to live events
    const stream = im.messages.subscribeEvents();

    await using _stream = stream;

    for await (const event of stream) {
      if (event.type === "message.received") {
        const { message, chatGuid, sequence } = event;
        
        if (!message.content.text || message.isFromMe) continue;

        await handleIncomingMessage(im, chatGuid, message.content.text);
        
        // Save sequence for next startup
        await saveSequence(sequence);
      }
    }
  } catch (error) {
    console.error("iMessage Service Error:", error);
  } finally {
    await im.close();
  }
}

async function handleIncomingMessage(im: any, chatGuid: string, text: string) {
  console.log(`\n👤 iMessage (${chatGuid}): ${text}`);

  try {
    const aiResponse = await processHealthMessage(chatGuid, text);
    const formattedResponse = formatResponse(aiResponse || "I'm sorry, I couldn't generate a response.");
    
    await im.messages.sendText(chatGuid, formattedResponse);
    console.log(`\n🤖 AI to iMessage: ${aiResponse}`);
  } catch (error) {
    console.error("Error processing iMessage:", error);
    await im.messages.sendText(chatGuid, formatResponse("I'm sorry, something went wrong. Please try again."));
  }
}


