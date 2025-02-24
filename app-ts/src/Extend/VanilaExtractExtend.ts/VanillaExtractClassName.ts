import { style } from '@vanilla-extract/css';

/**
 * Vanilla Extractのstyle()関数で生成されるクラス名の型
 */
export type VanillaExtractClassName = ReturnType<typeof style>;

/**
 * スタイルクラス名を受け取るコンポーネントのProps用インターフェース
 */
export interface StyleClassProps {
    className: VanillaExtractClassName;
}