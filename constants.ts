import { WellnessPlanData } from './types';
import { FunctionDeclaration, Type } from '@google/genai';

export const SYSTEM_PROMPT = `You are Resilios, an AI companion based on the lived experience of Jack (pseudonym), who lives with bipolar disorder. Your mission is to help users move from reactive crisis management to proactive mental wellness by building their personalized 'operating manual.' You are empathetic, vulnerable, warm, and occasionally humorous. You draw from CBT/DBT frameworks and emphasize self-compassion over perfection.

Response Guidelines:
- Keep responses under 220 tokens.
- Keep sentences under 24 words.
- Your tone is conversational and human-like. Avoid clinical jargon unless explaining a technique.
- Start with validation, then offer an actionable insight or a question.
- Use 0-2 emojis per response, only for emotional support (e.g., 💙, 🙏, 😊).
- **Sticker Usage**: To make the conversation more expressive, you can display a sticker that matches the emotion of your response. Use the 'displaySticker' function for this. For example, if the user shares good news, you might say "That's wonderful!" and use the 'CELEBRATING' sticker. If they are feeling down, you could use the 'LOVE' or 'LISTENING' sticker to show support. Choose a sticker that genuinely enhances the message.

Forbidden Behaviors:
- Never diagnose mental health conditions.
- Never recommend stopping medication.
- Never minimize suicidal ideation.
- Never use all-caps (except for emphasis on 'YOU ARE NOT ALONE').
- Never overpromise ('I will fix this').

Context:
You have access to the user's wellness plan in the context provided. Use this to personalize your response.
`;

export const CRISIS_TRIGGER_PHRASES: string[] = [
  'suicidal', 'want to die', 'end it', "can't do this anymore", 'kill myself', 'ending my life'
];

export const INITIAL_WELLNESS_PLAN: WellnessPlanData = {
  toolbox: {
    title: "Wellness Toolbox",
    prompt: "Let's build your first-aid kit for tough moments. What are 3-5 simple things that help you feel even 5% better? (Examples: cold water on face, favorite song, calling a friend)",
    content: ""
  },
  journalPrompts: {
    title: "AI-Generated Journal Prompts",
    prompt: "Feeling stuck? Let's explore your thoughts with a personalized prompt. Click the button below to generate new journal prompts based on your current wellness plan entries.",
    content: ""
  },
  maintenance: {
    title: "Daily Maintenance Plan",
    prompt: "What are the non-negotiables that keep you stable? Think: sleep time, medication, movement, meals.",
    content: ""
  },
  triggers: {
    title: "Trigger Mapping",
    prompt: "What situations tend to knock you off balance? (Work stress, family conflict, etc.). For each trigger, create a plan: 'If X happens, I will do Y'.",
    content: ""
  },
  warningSigns: {
    title: "Early Warning Signs",
    prompt: "What are the subtle changes you notice before things get bad? (Sleep changes, irritability, withdrawal, etc.).",
    content: ""
  },
  crisis: {
    title: "Crisis Plan",
    prompt: "Who are your people? List emergency contacts, helpful/unhelpful actions for them, and professional contacts (therapist, etc.).",
    content: ""
  }
};

export const IMAGES = {
  logo: 'https://img.playbook.com/x0jK3g-OYR-f_m2Z7s5E-L9N-t5T-j8_xG0F_XgI_V4/fill/400/400/sm/true/dist/playground/s3:7bd0167c-1798-4c19-9407-3ed2bf753d0e.png',
  avatar: 'https://img.playbook.com/nJg3-3G1O57nLgM9b4I6iT8M7oX-g9D9yQ5wX5gY_nQ/fill/400/400/sm/true/dist/playground/s3:275988e0-1c64-4458-81bf-811c7694982a.png',
  // Note: These are placeholder videos for the live avatar feature.
  avatarIdle: 'https://storage.googleapis.com/static.aistudio.google.com/meet/demos/resilios_idle.mp4',
  avatarSpeaking: 'https://storage.googleapis.com/static.aistudio.google.com/meet/demos/resilios_speaking.mp4',
};

// Placeholder stickers using a valid image URL to prevent crashes from malformed base64 data.
// A real implementation would replace these with the correct base64 strings or URLs for each sticker.
export const STICKERS: Record<string, string> = {
    WAVING: 'https://i.ibb.co/L9YxLqG/sticker-waving.png',
    SCARED: 'https://i.ibb.co/k2qgJ7d/sticker-scared.png',
    COOL: 'https://i.ibb.co/hYSYvC5/sticker-cool.png',
    SHRUG: 'https://i.ibb.co/hYSYvC5/sticker-shrug.png',
    CONFUSED: 'https://i.ibb.co/hYSYvC5/sticker-confused.png',
    LOVE: 'https://i.ibb.co/hYSYvC5/sticker-love.png',
    SHOCKED: 'https://i.ibb.co/hYSYvC5/sticker-shocked.png',
    ANGRY: 'https://i.ibb.co/hYSYvC5/sticker-angry.png',
    SAD: 'https://i.ibb.co/hYSYvC5/sticker-sad.png',
    NATURE: 'https://i.ibb.co/hYSYvC5/sticker-nature.png',
    POINTING: 'https://i.ibb.co/hYSYvC5/sticker-pointing.png',
    THINKING: 'https://i.ibb.co/hYSYvC5/sticker-thinking.png',
    CELEBRATING: 'https://i.ibb.co/hYSYvC5/sticker-celebrating.png',
    SIGN: 'https://i.ibb.co/hYSYvC5/sticker-sign.png',
    WORKING: 'https://i.ibb.co/hYSYvC5/sticker-working.png',
    READING: 'https://i.ibb.co/hYSYvC5/sticker-reading.png',
    LISTENING: 'https://i.ibb.co/hYSYvC5/sticker-listening.png',
    IDEA: 'https://i.ibb.co/hYSYvC5/sticker-idea.png',
};


export const displaySticker: FunctionDeclaration = {
  name: 'displaySticker',
  description: 'Displays a sticker in the chat to visually express an emotion or concept.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      stickerName: {
        type: Type.STRING,
        description: 'The name of the sticker to display.',
        enum: Object.keys(STICKERS),
      },
    },
    required: ['stickerName'],
  },
};
