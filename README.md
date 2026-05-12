# 🏥 MediChat AI

A production-ready health assistant integrated with **Photon/Spectrum** for seamless iMessage interaction. MediChat AI provides intelligent medical triage, emergency detection, and personalized health memory using advanced AI models.

## ✨ Features

- 📱 **Photon/Spectrum Integration**: Unified messaging across iMessage and Terminal platforms.
- 🩺 **AI Symptom Triage**: Empathetic, soft-toned medical triage powered by Gemini 1.5 Flash.
- 🚨 **Emergency Detection**: Real-time identification of critical symptoms with immediate safety protocols.
- 🧠 **Health Memory**: Persistent storage of user profiles, past assessments, and medical history.
- 🏥 **Medical Facility Locator**: Location-aware hospital and clinic finder (extensible hook).
- 💬 **Soft Healthcare Tone**: Specifically crafted prompts designed for a supportive and calming user experience.

## 📂 Project Structure

```text
medichat-ai/
├── src/
│   ├── index.ts           # Main entry & Spectrum orchestration
│   ├── config/
│   │   └── env.ts         # Environment variable management
│   ├── ai/
│   │   ├── triage.ts      # AI triage engine
│   │   ├── prompts.ts     # Health-focused system prompts
│   │   └── emergency.ts   # Critical symptom detection
│   ├── services/
│   │   ├── healthMemory.ts # User profile & history management
│   │   ├── hospitalFinder.ts # Medical facility lookup service
│   │   └── reminder.ts    # Medication & follow-up reminders
│   ├── utils/
│   │   └── responseFormatter.ts # Message formatting for iMessage
│   └── types/
│       └── health.ts      # Core data interfaces
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or Yarn
- Photon/Spectrum Account
- Gemini API Key (Google AI Studio)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/0xaje/MediChat-AI.git
   cd MediChat-AI
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy the example environment file and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` with your PROJECT_ID, PROJECT_SECRET, GEMINI_API_KEY, etc.*

4. **Run in Development**:
   ```bash
   npm run dev
   ```

## 🛡️ Design Philosophy

MediChat AI is built on a **"Safety First, Compassion Always"** foundation. The architecture strictly separates critical safety logic (Emergency Detection) from general AI reasoning (Triage Engine) to ensure absolute reliability in high-stakes situations.

## ⚖️ Disclaimer

*MediChat AI is an AI-powered assistant designed for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.*

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.
