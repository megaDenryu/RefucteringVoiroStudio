/**
 * テキスト入力や一般的なinput要素に対して、値を設定しchangeイベントを発火する
 */
export function simulateInputValueChange(inputElement: HTMLInputElement, targetValue: string): void {
    inputElement.value = targetValue;
    const event = new Event('change', { bubbles: true });
    inputElement.dispatchEvent(event);
}

/**
 * スライダー(input type="range")に対して、値を設定しchangeイベントを発火する
 */
export function simulateSliderValueChange(sliderElement: HTMLInputElement, targetValue: number): void {
    if (sliderElement.type !== "range") {
        console.warn(`Element is not a range slider.`);
        return;
    }
    sliderElement.value = targetValue.toString();
    const event = new Event('change', { bubbles: true });
    sliderElement.dispatchEvent(event);
}

/**
 * チェックボックス(input type="checkbox")のチェック状態を設定しchangeイベントを発火する
 */
export function simulateCheckboxChange(checkboxElement: HTMLInputElement, targetChecked: boolean): void {
    if (checkboxElement.type !== "checkbox") {
        console.warn(`Element is not a checkbox.`);
        return;
    }
    checkboxElement.checked = targetChecked;
    const event = new Event('change', { bubbles: true });
    checkboxElement.dispatchEvent(event);
}

/**
 * ラジオボタン(input type="radio")の選択状態を設定しchangeイベントを発火する
 */
export function simulateRadioChange(radioElement: HTMLInputElement, targetChecked: boolean): void {
    if (radioElement.type !== "radio") {
        console.warn(`Element is not a radio button.`);
        return;
    }
    radioElement.checked = targetChecked;
    const event = new Event('change', { bubbles: true });
    radioElement.dispatchEvent(event);
}