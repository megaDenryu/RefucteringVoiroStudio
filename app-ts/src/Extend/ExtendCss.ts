


/**
 * // 例: .padding クラスの padding と background-color を変更（新しいプロパティの追加を許可）
        StyleUpdater.updateClassStyles('padding', {
            padding: '20px',
            backgroundColor: 'lightblue'
        }, true);

        // 例: .padding クラスの既存のプロパティのみを変更（新しいプロパティの追加を禁止）
        StyleUpdater.updateClassStyles('padding', {
            padding: '20px',
            backgroundColor: 'lightblue' // このプロパティは追加されません
        }, false);
 * 
 */

class StyleUpdater {
    static updateClassStyles(className: string, styles: { [key: string]: string }, allowAdd: boolean = true) {
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            const styleSheet = styleSheets[i] as CSSStyleSheet;
            const rules = styleSheet.cssRules || styleSheet.rules;
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j] as CSSStyleRule;
                if (rule.selectorText === `.${className}`) {
                    for (const property in styles) {
                        if (styles.hasOwnProperty(property)) {
                            if (allowAdd || rule.style[property as any] !== undefined) {
                                rule.style[property as any] = styles[property];
                            }
                        }
                    }
                    return;
                }
            }
        }
    }
}