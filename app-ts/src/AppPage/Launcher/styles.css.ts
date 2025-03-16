import { style } from '@vanilla-extract/css';
import { ttsColors } from '../../UtilityVanillExtractCss/TTSSoft/styles.css';
import { TTSSoftware } from '../../ValueObject/Character';

const baseButton = style({
  border: 'none',
  borderRadius: '5px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
});

export const cevioAIButton = style([
  baseButton,
  {
    backgroundColor: ttsColors.cevioAI.primary,
    color: 'white',
    ':hover': {
      backgroundColor: ttsColors.cevioAI.secondary,
    }
  }
]);

export const aiVoiceButton = style([
  baseButton,
  {
    backgroundColor: ttsColors.aiVoice.primary,
    color: 'white',
    ':hover': {
      backgroundColor: ttsColors.aiVoice.secondary,
    }
  }
]);

// ...同様にVoiceVoxとCoeiroinkのボタンスタイルも定義
export const voiceVoxButton = style([
    baseButton,
    {
        backgroundColor: ttsColors.voiceVox.primary,
        color: 'white',
        ':hover': {
        backgroundColor: ttsColors.voiceVox.secondary,
        }
    }
]);

export const coeiroinkButton = style([
    baseButton,
    {
        backgroundColor: ttsColors.coeiroink.primary,
        color: 'white',
        ':hover': {
        backgroundColor: ttsColors.coeiroink.secondary,
        }
    }
]);

// 共通ベーススタイル
const launchButtonBase = style({
  border: 'none',
  padding: '10px 20px',
  width: "100%",
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
  color: 'white',
  position: 'relative',
  paddingLeft: '35px',
  boxSizing: 'border-box',
  margin: 0,
  '::before': {
    content: '"⚙️"',
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px'
  }
});

// オープン状態のボタンスタイル（緑色）
export const launchOpenButton = style([
  launchButtonBase,
  {
    backgroundColor: 'green',
    ':hover': {
      backgroundColor: 'darkgreen',
    }
  }
]);

// クローズ状態のボタンスタイル（赤色）
export const launchCloseButton = style([
  launchButtonBase,
  {
    backgroundColor: 'red',
    ':hover': {
      backgroundColor: 'darkred',
    }
  }
]);