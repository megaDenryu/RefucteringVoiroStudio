import { IResultBase } from "../../BaseClasses/ResultBase";

/**
 * テキスト入力や一般的なinput要素に対して、値を設定しchangeイベントを発火する
 */
export function simulateInputValueChange(inputElement: HTMLInputElement, targetValue: string): IResultBase {
    inputElement.value = targetValue;
    const event = new Event('change', { bubbles: true });
    inputElement.dispatchEvent(event);
    return { success: true };
}

/**
 * スライダー(input type="range")に対して、値を設定しchangeイベントを発火する
 */
export function simulateSliderValueChange(sliderElement: HTMLInputElement, targetValue: number): IResultBase {
    if (sliderElement.type !== "range") {
        console.warn(`Element is not a range slider.`);
        return { success: false };
    }
    sliderElement.value = targetValue.toString();
    const event = new Event('change', { bubbles: true });
    sliderElement.dispatchEvent(event);
    return { success: true };
}

/**
 * チェックボックス(input type="checkbox")のチェック状態を設定しchangeイベントを発火する
 */
export function simulateCheckboxChange(checkboxElement: HTMLInputElement, targetChecked: boolean): IResultBase {
    if (checkboxElement.type !== "checkbox") {
        return { success: false };
    }
    checkboxElement.checked = targetChecked;
    const event = new Event('change', { bubbles: true });
    checkboxElement.dispatchEvent(event);
    return { success: true };
}

/**
 * ラジオボタン(input type="radio")の選択状態を設定しchangeイベントを発火する
 */
export function simulateRadioChange(radioElement: HTMLInputElement, targetChecked: boolean): IResultBase {
    if (radioElement.type !== "radio") {
        console.warn(`Element is not a radio button.`);
        return { success: false };
    }
    radioElement.checked = targetChecked;
    const event = new Event('change', { bubbles: true });
    radioElement.dispatchEvent(event);
    return { success: true };
}