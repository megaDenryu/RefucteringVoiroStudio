/**
 * 指定されたHTMLSelectElementの中から、
 * targetValue に一致する option を選択し、change イベントを発火する
 */
export function simulateSelectValueChange(selectElement: HTMLSelectElement, targetValue: string): void {
    let optionFound = false;
    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        if (option.value === targetValue) {
            selectElement.selectedIndex = i;
            optionFound = true;
            break;
        }
    }
    if (!optionFound) {
        console.warn(`Option with value "${targetValue}" not found.`);
    }
    const event = new Event('change', { bubbles: true });
    selectElement.dispatchEvent(event);
}



