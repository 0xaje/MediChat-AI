import fs from 'fs/promises';
import path from 'path';

type HealthProfile = {
  symptoms: string[];
  medications: string[];
};

const MEMORY_FILE = path.join(process.cwd(), 'scratch/memory.json');

let memoryDB: Map<string, HealthProfile> = new Map();

// Initialize memory from file
async function initMemory() {
  try {
    const data = await fs.readFile(MEMORY_FILE, 'utf-8');
    const json = JSON.parse(data);
    memoryDB = new Map(Object.entries(json));
  } catch (error) {
    // If file doesn't exist, start with empty memory
    memoryDB = new Map();
  }
}

// Save memory to file
async function saveMemory() {
  try {
    const obj = Object.fromEntries(memoryDB.entries());
    await fs.mkdir(path.dirname(MEMORY_FILE), { recursive: true });
    await fs.writeFile(MEMORY_FILE, JSON.stringify(obj, null, 2));
  } catch (error) {
    console.error('Error saving memory:', error);
  }
}

// Call init on load
initMemory();

export async function saveSymptoms(
  userId: string,
  symptom: string
) {
  let profile = memoryDB.get(userId);

  if (!profile) {
    profile = {
      symptoms: [symptom],
      medications: [],
    };
    memoryDB.set(userId, profile);
  } else {
    profile.symptoms.push(symptom);
  }

  await saveMemory();
}

export async function getProfile(userId: string): Promise<HealthProfile | undefined> {
  return memoryDB.get(userId);
}

