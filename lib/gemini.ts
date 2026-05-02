import { GoogleGenerativeAI } from '@google/generative-ai';
import { DayData, TaskStatus } from './types';
import { TASKS, SUBJECTS } from './constants';
import { format } from 'date-fns';

const STRENGTH = {
  tone: "stoic, concise, no-nonsense, encouraging but strict",
  focus: "daily consistency, no excuses, building a legacy, deep work",
  audience: "Rajarshi, a CSE student building a premium habit tracker called GRIND"
};

// function to get AI model lazily
const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  return genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" }); // Using flash for speed
};

export async function generateDailyBriefing(
  name: string,
  todayDate: string,
  dayOfWeek: string,
  taskList: string,
  todaySubject: string,
  currentPathStage: string,
  stagePct: number,
  streakSummary: string,
  yesterdayStats: string,
  weekStats: string,
  yesterdayMood: string
) {
  try {
    const prompt = `
You are a sharp, no-nonsense productivity coach for Rajarshi, a 21-year-old BTech CSE student in Kolkata.

His schedule today (${todayDate}, ${dayOfWeek}):
${taskList}

College subject today: ${todaySubject}
Current learning stage: ${currentPathStage} at ${stagePct}%
Current streaks: ${streakSummary}
Yesterday's completion: ${yesterdayStats}
Week so far: ${weekStats}
Mood yesterday: ${yesterdayMood}

Write a sharp, motivating daily briefing in exactly 3 parts:

1. ONE sentence energy check (based on their recent data — honest, not fake hype)
2. TWO specific focus points for today (based on their weakest recent tasks)
3. ONE line reminder about their path progress

Tone: Like a senior dev mentor who doesn't sugarcoat. Max 80 words total. No emojis.
    `;

    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini failed:", error);
    return "1. The systems are quiet, but discipline isn't.\n2. Focus on doing the work. Execute the plan.\n3. Keep building your legacy.";
  }
}

export async function generateWeeklyReview(
  weekNumber: number,
  weekStart: string,
  weekEnd: string,
  dailyBreakdown: string,
  taskStats: string,
  skipData: string,
  moodData: string,
  streakChanges: string,
  pathProgress: string,
  subjData: string
) {
  try {
    const prompt = `
You are analyzing Rajarshi's habit data for week ${weekNumber} (${weekStart} to ${weekEnd}).

WEEK DATA:
Daily completions: ${dailyBreakdown}
Task-by-task stats: ${taskStats}
Skips this week: ${skipData}
Mood scores: ${moodData}
Streak changes: ${streakChanges}
Learning path progress: ${pathProgress}
College subjects covered: ${subjData}

Write a weekly performance review in 4 parts:

1. VERDICT (one bold sentence — honest grade of the week: S/A/B/C/D with one reason)
2. WINS (2 specific things done well, reference actual data)
3. GAPS (2 specific things to fix next week, reference actual data)
4. NEXT WEEK FOCUS (one concrete priority)

Tone: Direct, data-driven, zero fluff.
Max 120 words. Format with clear labels.
    `;

    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini failed:", error);
    return "VERDICT: Incomplete Data\nWINS: Survived the week.\nGAPS: Need more tracking data.\nNEXT WEEK FOCUS: Consistency.";
  }
}

export async function generateStreakRecovery(
  taskName: string,
  streakDays: number,
  weekPct: number,
  stage: string,
  pct: number,
  otherStreaks: string
) {
  try {
    const prompt = `
Rajarshi just broke his ${taskName} streak of ${streakDays} days.

His recent context:
- Week completion rate: ${weekPct}%
- Current path stage: ${stage} at ${pct}%
- Other active streaks: ${otherStreaks}

Write a 2-sentence recovery message.
Acknowledge the loss honestly (don't dismiss it).
Then redirect to action immediately.
Tone: Like a coach after a loss. Tough but fair.
No emojis. No "it's okay". Max 40 words.
    `;

    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "The streak is gone, but the work remains. Start over right now.";
  }
}

export async function generateTaskInsights(
  taskName: string,
  rate: number,
  streak: number,
  bestStreak: number,
  skipPattern: string,
  recentData: string
) {
  try {
    const prompt = `
Task: ${taskName}
All time completion rate: ${rate}%
Current streak: ${streak} days
Best streak: ${bestStreak} days
Skip pattern: ${skipPattern}
Recent 14 days: ${recentData}

Give a 2-sentence insight about this specific task's pattern and one actionable suggestion.
Be specific to the data. Max 50 words.
    `;
    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Data processing failed. Trust your gut and put in the reps.";
  }
}

export async function generateSmartQuote(
  streakSummary: string,
  recentRate: number,
  stage: string,
  dayName: string
) {
  try {
    const prompt = `
Rajarshi's stats today:
- Streak status: ${streakSummary}
- Recent completion rate: ${recentRate}%
- Current path: ${stage}
- Day of week: ${dayName}

Generate ONE short motivational quote (max 15 words) relevant to his current situation. Do not attribute it to anyone.
Make it feel like it was written for him specifically. No generic quotes.
    `;
    const model = getModel();
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
    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Data processing failed. Trust your gut. Keep putting in the reps.";
  }
}

export async function generateChatResponse(history: { role: string; parts: { text: string }[] }[], message: string) {
  try {
    const model = getModel();
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are an AI coach for "GRIND". Tone: stoic, concise, no-nonsense, hard work focused. The user is a CSE developer. Keep answers relatively short. Never mention you are an AI model.`}]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am your coach. Let's get to work." }]
        },
        ...history
      ]
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Chat failed:", error);
    return "Connection degraded. Keep working.";
  }
}
