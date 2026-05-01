import { GoogleGenerativeAI } from '@google/generative-ai';
import { DayData, TaskStatus } from './types';
import { TASKS, SUBJECTS } from './constants';
import { format } from 'date-fns';

const STRENGTH = {
  tone: "stoic, concise, no-nonsense, encouraging but strict",
  focus: "daily consistency, no excuses, building a legacy, deep work",
  audience: "Rajarshi, a CSE student building a premium habit tracker called GRIND"
};

// Initialize the API client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using flash for speed

export async function generateDailyBriefing(
  name: string,
  currentStreak: number,
  bestStreak: number,
  yesterdayData?: DayData
) {
  try {
    const prompt = `
      You are the AI coach for a student named ${name}. The app is "GRIND".
      Tone: ${STRENGTH.tone}.
      Focus: ${STRENGTH.focus}.

      Current streak: ${currentStreak} days.
      Best streak: ${bestStreak} days.
      Yesterday's performance: ${yesterdayData ? JSON.stringify(yesterdayData) : 'No data recorded'}.

      Tasks include: ${TASKS.map(t => t.name).join(', ')}.

      Task: Write a highly motivating, stoic, 3-4 sentence morning briefing to start the day.
      Acknowledge yesterday's effort (if any) and push for today's excellence.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini failed:", error);
    return "The server is quiet today. Stay stoic. Focus on the work. No excuses. Execute the plan.";
  }
}

export async function generateWeeklyReview(
  name: string,
  weekData: Record<string, DayData>,
  completionPercentage: number
) {
  try {
    const prompt = `
      You are the AI coach for ${name}. The app is "GRIND".
      Tone: ${STRENGTH.tone}.

      This week's completion rate: ${completionPercentage}%.
      Data: ${JSON.stringify(weekData)}.

      Task: Provide a critical weekly review. If completion > 80%, praise them but remind them not to get soft. 
      If < 50%, give them a highly disciplined wake-up call about wasting time. Max 4 sentences.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini failed:", error);
    return "Review the week objectively. Identify weaknesses. Attack them. Move forward.";
  }
}

export async function generateStreakRecovery(name: string, daysMissed: number) {
  try {
    const prompt = `
      You are the AI coach for ${name}. App: "GRIND".
      Tone: disciplined, unapologetic.

      They just missed ${daysMissed} days in a row and broke their streak. 

      Task: Write a 2-sentence wake up call to get them back on track immediately. No coddling.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "The streak is gone, but the work remains. Start over right now.";
  }
}

export async function generateSmartQuote() {
  try {
    const prompt = `Generate a single, profound, stoic, short quote about discipline, consistency, or hard work. Do not include the author. Just the quote. Format it flawlessly.`;
    const result = await model.generateContent(prompt);
    return result.response.text().replace(/["']/g, '').trim();
  } catch (error) {
    return "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.";
  }
}

export async function generateInsights(days: Record<string, DayData>) {
  try {
    const daysKeys = Object.keys(days);
    if (daysKeys.length < 3) return "Keep grinding. Detailed insights require more data.";

    const prompt = `
      You are an analytical engine for "GRIND". 
      Analyze the following habit log data:
      ${JSON.stringify(days)}

      Task: Identify one specific pattern or weakness, and give one actionable instruction to fix it. Keep it under 3 sentences. Stoic tone.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Data processing failed. Trust your gut. Keep putting in the reps.";
  }
}
