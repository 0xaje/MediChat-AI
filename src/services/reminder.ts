import fs from 'fs/promises';
import path from 'path';

type Reminder = {
  id: string;
  userId: string;
  type: 'medication' | 'follow-up';
  text: string;
  time: string;
  createdAt: string;
};

const REMINDERS_FILE = path.join(process.cwd(), 'scratch/reminders.json');

export class ReminderService {
  private async saveReminder(reminder: Reminder) {
    try {
      let reminders: Reminder[] = [];
      try {
        const data = await fs.readFile(REMINDERS_FILE, 'utf-8');
        reminders = JSON.parse(data);
      } catch (e) {}

      reminders.push(reminder);
      await fs.mkdir(path.dirname(REMINDERS_FILE), { recursive: true });
      await fs.writeFile(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  }

  async setMedicationReminder(userId: string, medication: string, time: string): Promise<string> {
    const reminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type: 'medication',
      text: medication,
      time,
      createdAt: new Date().toISOString(),
    };

    await this.saveReminder(reminder);
    console.log(`Setting reminder for ${userId}: ${medication} at ${time}`);
    return `Reminder set for ${medication} at ${time}. Stay healthy!`;
  }

  async setFollowUpReminder(userId: string, reason: string, date: Date): Promise<string> {
    const reminder: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type: 'follow-up',
      text: reason,
      time: date.toISOString(),
      createdAt: new Date().toISOString(),
    };

    await this.saveReminder(reminder);
    console.log(`Setting follow-up for ${userId}: ${reason} on ${date.toDateString()}`);
    return `Follow-up scheduled for ${reason} on ${date.toDateString()}.`;
  }

  async getReminders(userId: string): Promise<Reminder[]> {
    try {
      const data = await fs.readFile(REMINDERS_FILE, 'utf-8');
      const reminders: Reminder[] = JSON.parse(data);
      return reminders.filter(r => r.userId === userId);
    } catch (e) {
      return [];
    }
  }
}
