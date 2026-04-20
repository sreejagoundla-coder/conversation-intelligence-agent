# 🧠 Conversation Intelligence AI  
### Your AI-Powered Real-Time Meeting Assistant

> Transform conversations into actionable intelligence — instantly.

---

## 📌 Overview

**Conversation Intelligence AI** is a real-time, AI-driven meeting assistant designed to enhance sales and client interactions.  
It listens to live conversations, converts speech into text, and delivers intelligent insights such as objections, intent, sentiment, and next-best actions — all in real time.

This system acts as a **live AI coach**, helping users navigate conversations more effectively and improve decision-making during meetings.

---

## 🎯 Objectives

- Assist users during live client conversations
- Identify critical signals such as objections and hesitation
- Provide real-time suggestions to improve communication
- Reduce the risk of deal loss through intelligent warnings
- Simulate “hindsight intelligence” using AI-driven pattern reasoning

---

## 🚨 Problem Statement

In real-world sales and client-facing scenarios:

- Important signals (like objections or hesitation) are often missed
- Users struggle to respond effectively under pressure
- Post-meeting analysis is delayed and inefficient
- No lightweight tool provides **live, in-meeting intelligence**

---

## 💡 Proposed Solution

This project introduces a **real-time conversation intelligence system** that:

1. Captures live voice input during meetings  
2. Converts speech into text continuously  
3. Sends conversation chunks to an AI engine  
4. Analyzes context using natural language processing  
5. Returns structured insights instantly  

---

## 🔑 Core Features

### 🎙️ 1. Real-Time Voice Capture
- Uses browser microphone access
- Continuously listens during meetings
- No manual input required

---

### 📝 2. Live Speech-to-Text Transcription
- Converts spoken conversation into text
- Displays real-time transcript
- Supports continuous streaming

---

### 🧠 3. AI-Powered Conversation Analysis
The system analyzes conversation snippets to extract:

- **Objections** (e.g., pricing, trust, integration)
- **Intent** (interested, hesitant, rejecting, evaluating)
- **Sentiment** (positive, neutral, negative)

---

### 💡 4. Smart Suggestion Engine
- Recommends what the user should say next
- Provides actionable, concise responses
- Helps guide conversation flow

---

### 🚨 5. Risk Detection System
- Identifies potential deal risks
- Flags hesitation, delay signals, or rejection indicators
- Alerts user in real time

---

### 🧠 6. Hindsight Intelligence (Simulated)
- Generates pattern-based insights
- Mimics learning from past conversations
- Provides contextual guidance

---

### ❤️ 7. Human-Centered AI Experience
- Friendly, non-robotic tone
- Acts like a supportive assistant
- Enhances user confidence

---

## 🏗️ System Architecture
🎙️ Voice Input ↓ 📝 Speech Recognition (Frontend) ↓ 📦 Text Chunking ↓ 🌐 API Request ↓ 🧠 AI Analysis Engine (Backend) ↓ 📊 Structured Insights ↓ 🖥️ Real-Time UI Display

---

## 🧰 Tech Stack

### 🔹 Frontend
- React (Vite)
- JavaScript (ES6+)
- TypeScript
- HTML5 / CSS3
- Web Speech API (SpeechRecognition)

---

### 🔹 Backend
- FastAPI (Python)
- REST API architecture

---

### 🔹 AI Layer
- OpenAI API (LLM-based analysis)
- Prompt engineering for structured outputs

---

### 🔹 Deployment
- Frontend: Vercel  
- Backend: Render  

---

## 📁 Project Structure

Conversation-Intelligence-Agent
│
├── frontend/                          # React Frontend (UI Layer)
│   ├── src/
│   │   ├── components/
│   │   │   ├── MicRecorder.jsx        # Handles mic input & speech recognition
│   │   │   ├── Transcript.jsx         # Displays live transcript
│   │   │   ├── InsightsPanel.jsx      # Shows AI insights
│   │   │
│   │   ├── App.jsx                    # Main UI layout
│   │   ├── main.jsx                   # React entry point
│   │
│   ├── index.html                     # Root HTML
│   └── package.json                   # Frontend dependencies
│
├── backend/                           # FastAPI Backend (AI Engine)
│   ├── main.py                        # API routes (/analyze)
│   ├── analyzer.py                    # AI logic & prompt handling
│   ├── requirements.txt               # Python dependencies
│   └── .env                           # Environment variables (API key)
│
└── README.md                          # Documentation


### 🔍 Workflow Explanation

1. **Voice Capture**
   - User speaks during a live meeting
   - Browser captures audio using microphone

2. **Speech-to-Text Conversion**
   - Web Speech API converts voice into text in real time

3. **Chunking Mechanism**
   - Text is grouped into meaningful chunks before sending to backend
   - Reduces API calls and improves performance

4. **Backend Processing**
   - FastAPI receives text input
   - Sends prompt to AI model for analysis

5. **AI Analysis**
   - Detects:
     - Objections
     - Intent
     - Sentiment
     - Risk signals
   - Generates suggestions and insights

6. **Real-Time UI Update**
   - Insights are displayed instantly on the dashboard
   - Acts as a live assistant during conversation

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup

bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
--------

💻 Frontend Setup
Bash
cd frontend
npm install
npm run dev

------
🎤 Demo Instructions
Open the application
Click Start Listening
Speak a sample sales conversation
Observe:
Live transcript
AI-generated insights
🧪 Sample Input
“The pricing feels high and we are comparing other tools before deciding.”

-------
📊 Expected Output
Objection: Pricing
Intent: Hesitant
Sentiment: Slightly Negative
Suggestion: Highlight ROI
Warning: Potential delay or drop risk
Insight: Pricing concerns often indicate value uncertainty

-------
🚀 Future Enhancements
Persistent conversation memory (database integration)
Deal success prediction using ML models
Multi-language support
Dashboard analytics and reporting
CRM integration
Voice emotion detection

-------

Demo Video Link: 
https://drive.google.com/file/d/1RGhI0kzTbeVKgixvKcPFlDvq4vB0EVkH/view?usp=drivesdk

 Team Members

[Sreeja Goundla]
[Sindhu Reddy]
[Shaiinit varsha]
[akshaya]
[Bindhu]

------
🏆 Acknowledgment

This project was developed as part of a hackathon to explore the potential of AI in real-time decision support systems.
