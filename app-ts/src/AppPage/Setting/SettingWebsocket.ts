import { RequestAPI } from "../../Web/RequestApi";


export type PageMode = "Setting" | "Chat";
export type SettingMode = "AppSettings";
export interface WebSocketParams {
    clientId: string;
    setting_mode: SettingMode;
    page_mode: PageMode;
}

// handleWebSocketMessage 関数の型定義
export type HandleWebSocketMessage = (event: MessageEvent) => void;

export function createWebSocket(
        params: WebSocketParams, 
        handleWebSocketMessage:HandleWebSocketMessage //websocketで値を受け取ったときの処理
    ): WebSocket {
    const { clientId, setting_mode, page_mode } = params;
    const url = `ws://localhost:${RequestAPI.port}/settingStore/${clientId}/${setting_mode}/${page_mode}`;
    const websocket = new WebSocket(url);

    websocket.onopen = (event) => {
        console.log("WebSocket is open now.");
    };

    websocket.onmessage = (event) => {
        handleWebSocketMessage(event);
    };

    websocket.onclose = (event) => {
        console.log("WebSocket is closed now.");
    };

    websocket.onerror = (event) => {
        console.error("WebSocket error observed:", event);
    };

    return websocket;
}