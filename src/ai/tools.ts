import { findNearbyHospitals } from "../services/hospitalFinder.js";
import { saveSymptoms, getProfile } from "../services/healthMemory.js";
import { ReminderService } from "../services/reminder.js";

const reminderService = new ReminderService();

export const tools = [
  {
    type: "function",
    function: {
      name: "find_nearby_hospitals",
      description: "Find hospitals near a specific location when the user needs urgent care or a checkup.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city or area to search for hospitals in.",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "record_symptom",
      description: "Record a symptom the user is experiencing for their health profile.",
      parameters: {
        type: "object",
        properties: {
          symptom: {
            type: "string",
            description: "The symptom to record (e.g., 'headache', 'fever').",
          },
        },
        required: ["symptom"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_medication_reminder",
      description: "Set a reminder for the user to take their medication.",
      parameters: {
        type: "object",
        properties: {
          medication: {
            type: "string",
            description: "The name of the medication.",
          },
          time: {
            type: "string",
            description: "The time to take the medication (e.g., '8:00 AM', 'daily at night').",
          },
        },
        required: ["medication", "time"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_health_profile",
      description: "Retrieve the user's recorded health profile including symptoms and medications.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_reminders",
      description: "Retrieve the user's scheduled reminders for medications and follow-ups.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
] as const;

export async function handleToolCall(name: string, args: any, userId: string) {
  switch (name) {
    case "find_nearby_hospitals":
      const hospitals = await findNearbyHospitals(args.location);
      return JSON.stringify({ hospitals });

    case "record_symptom":
      await saveSymptoms(userId, args.symptom);
      return JSON.stringify({ status: "success", message: `Recorded ${args.symptom}` });

    case "set_medication_reminder":
      const result = await reminderService.setMedicationReminder(userId, args.medication, args.time);
      return JSON.stringify({ result });

    case "get_health_profile":
      const profile = await getProfile(userId);
      return JSON.stringify(profile || { symptoms: [], medications: [] });

    case "get_reminders":
      const reminders = await reminderService.getReminders(userId);
      return JSON.stringify({ reminders });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
