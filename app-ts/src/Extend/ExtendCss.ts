


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

export class CSSProxuOut {
    private _styleValue: string;

    constructor(styleValue: string) {
        this._styleValue = styleValue;
    }

    public get value(): string {
        return this._styleValue;
    }

    public toNum(removeStr: string): number|null {
        try {
            const numericValue = this._styleValue.replace(removeStr, '');
            const result = Number(numericValue);
            if (isNaN(result)) {
                throw new Error(`CSSProxuOut.toNum: '${this._styleValue}' から '${removeStr}' を取り除いた結果 '${numericValue}' は数値に変換できません`);
            }
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

function testOut() {   // 使用例
    const cssValue = new CSSProxuOut("20px");
    const numberValue = cssValue.toNum("px");
    console.log(numberValue); // 20
}

export class CSSProxy {
    private static classStyles: { [className: string]: CSSStyleDeclaration } = {};

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
                                // コレクションも更新
                                if (!CSSProxy.classStyles[className]) {
                                    CSSProxy.classStyles[className] = rule.style;
                                }
                                CSSProxy.classStyles[className][property as any] = styles[property];
                            }
                        }
                    }
                    return;
                }
            }
        }
    }

    static getClassStyleProperty(className: string, property: string): CSSProxuOut | null {
        // まずコレクションから取得を試みる
        if (CSSProxy.classStyles[className]) {
            return new CSSProxuOut(CSSProxy.classStyles[className][property as any]) || null;
        }
    
        // コレクションにない場合はスタイルシートから取得
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            const styleSheet = styleSheets[i] as CSSStyleSheet;
    
            // スタイルシートが同一オリジンであるかを確認
            if (styleSheet.href && new URL(styleSheet.href).origin !== window.location.origin) {
                continue;
            }
    
            try {
                const rules = styleSheet.cssRules || styleSheet.rules;
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j] as CSSStyleRule;
                    if (rule.selectorText === `.${className}`) {
                        // コレクションに保存
                        CSSProxy.classStyles[className] = rule.style;
                        return new CSSProxuOut(rule.style[property as any]) || null;
                    }
                }
            } catch (e) {
                console.warn(`Cannot access cssRules for stylesheet: ${styleSheet.href}`, e);
                continue;
            }
        }
        return null;
    }


}

function test() {
    // 使用例
    CSSProxy.updateClassStyles('padding', {
        padding: '20px',
        backgroundColor: 'lightblue'
    }, true);

    const paddingValue = CSSProxy.getClassStyleProperty('padding', 'padding');
    console.log(paddingValue); // 例: '20px'
}
