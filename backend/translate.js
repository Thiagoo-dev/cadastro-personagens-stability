// translate.js - helper (ESM) to translate prompts to English using @vitalets/google-translate-api
import translate from '@vitalets/google-translate-api';

export async function translateToEnglish(text) {
  if (!text || typeof text !== 'string') return text;
  try {
    const res = await translate(text, { to: 'en' });
    return res.text;
  } catch (err) {
    console.error('Translation error:', err);
    return text;
  }
}
