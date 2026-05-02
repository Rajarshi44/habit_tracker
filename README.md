# 🦅 GRIND: Execution Without Fluff.

> *Amateurs sit and wait for inspiration, the rest of us just get up and go to work.*

**GRIND** is a brutalist, no-nonsense productivity and habit tracking platform engineered specifically for developers, engineers, and deep-workers. It strips away the gamification, cute aesthetics, and visual clutter of traditional habit trackers to focus on one thing: **Absolute Consistency.**

---

## 🏛️ The Philosophy
Most habit trackers want to be your friend. GRIND wants to be your coach. 
The interface is intentionally dark, editorial, and unapologetically minimal. There are no streaks to "protect" with gems, no social sharing, and no bright celebratory confetti. It is designed to look and feel like a high-end command center for your life and career.

---

## ⚡ Core Features & Capabilities

### 🎛️ 1. The Execution Dashboard
A distraction-free, brutalist daily view of your tasks.
- **Binary States**: Mark your scheduled blocks as done, skipped, or failed. No "half-credit."
- **Context-Aware**: The dashboard automatically pulls in your current learning stages and dynamic college subjects so you know exactly what you should be working on at any given hour.
- **Editorial UI**: A premium, typography-heavy design that feels like reading a declassified blueprint.

### 🛣️ 2. Dynamic Learning Pipeline
Stop wondering what tutorial or project to do next. Automate your skill progression.
- **Sequential Roadmaps**: Set up a sequence of learning stages (e.g., `HTML` ➔ `JavaScript` ➔ `React` ➔ `Next.js`).
- **Progress Tracking**: Manually track your progression percentages as you study.
- **Auto-Progression**: Once a stage hits `100%`, the dashboard seamlessly and automatically transitions your learning block to the next subject in your pipeline.

### 🔄 3. Automated Subject Rotation
Designed for college students and multi-disciplinary learners.
- **Set and Forget**: Enter a comma-separated list of subjects (e.g., `DBMS, Computer Networks, Operating Systems, Data Structures`).
- **Dynamic Insertion**: GRIND will automatically rotate these subjects into your daily study blocks, ensuring you consistently review material without having to manually plan your week.

### 🧠 4. AI-Powered Stoic Intelligence (Gemini 3.1 Flash)
An AI coach that actually holds you accountable.
- **Daily Briefings**: Wake up to a personalized, data-driven daily briefing. The AI analyzes your previous week's performance, yesterday's mood, and your current streaks to give you one brutal, honest instruction for the day.
- **Weekly Reviews**: Receive harsh but fair weekly performance reviews that grade your execution (S/A/B/C/D) based entirely on data.
- **Contextual Quotes**: Get dynamically generated quotes tailored perfectly to your current pipeline stage and streak status.

### 📊 5. Advanced Analytics & Heatmaps
Don't guess how consistent you are. Measure it.
- **90-Day Execution Heatmap**: A stunning visualization of your daily effort.
- **Streak Recovery Engine**: Instead of "forgiving" broken streaks, the analytics engine identifies exact patterns of failure (e.g., "You always skip Web Dev on Thursdays") and warns you in advance.
- **Mood vs. Performance Tracking**: Correlate your daily subjective mood against your objective execution output.

### ☁️ 6. Seamless MongoDB Cloud Synchronization
Your protocol, everywhere.
- **Secure Backend**: Your data isn't trapped in local storage. Everything is securely synced to a MongoDB Atlas cluster.
- **Real-Time Hydration**: Log in from any device. Your tasks, history, pipelines, and granular settings are pulled from the cloud instantly using an optimized Zustand state engine.

---

## 🛠️ Setup & Initialization

To deploy and run your own instance of GRIND locally:

```bash
# 1. Clone the repository
git clone https://github.com/Rajarshi44/habit_tracker.git

# 2. Install dependencies
cd habit_tracker
npm install

# 3. Create your .env file
# You will need a MongoDB URI and a Gemini API Key
echo "MONGODB_URI=your_mongodb_connection_string" > .env
echo "NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key" >> .env

# 4. Start the development server
npm run dev
```

### 🚀 Initializing the Protocol
When you load the application for the first time, click **"Initialize Default Protocol"** in the settings. This will instantly populate the database with a highly optimized daily schedule, including the rotating college blocks and the web-development learning pipeline.

---
*Discipline equals freedom.*
