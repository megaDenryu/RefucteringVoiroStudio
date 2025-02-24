import { createGlobalTheme } from '@vanilla-extract/css';

export const ttsColors = createGlobalTheme(':root', {
  cevioAI: {
    primary: '#FF69B4',    // ピンク系
    secondary: '#FFB6C1',
  },
  aiVoice: {
    primary: 'rgb(157, 109, 167)',    // 青系
    secondary: 'rgb(157, 109, 167, 0.8)',
  },
  voiceVox: {
    primary: 'rgb(165, 212, 173)',    // 緑系
    secondary: 'rgb(165, 212, 173, 0.8)',
  },
  coeiroink: {
    // primary: '#FF8C00',    // オレンジ系
    // secondary: '#FFA07A',
    primary: "rgba(0, 0, 0)",
    secondary: "rgba(0, 0, 0, 0.48)",
  }
});