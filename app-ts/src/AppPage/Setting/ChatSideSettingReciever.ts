import { createWebSocket, HandleWebSocketMessage } from "./SettingWebsocket";

export class ChatSideSettingReciever {
    _websocket: WebSocket;
    _handleWebSocketMessage: HandleWebSocketMessage;
    constructor(clientId: string, handleWebSocketMessage:HandleWebSocketMessage) {
        this._handleWebSocketMessage = handleWebSocketMessage;
        console.log("ChatSideSettingReciever を作成");
        this._websocket = createWebSocket({
            clientId: clientId,
            setting_mode: "AppSettings",
            page_mode: "Chat"
        }, this.handleWebSocketMessage.bind(this));
    }

    handleWebSocketMessage(event: MessageEvent) {
        this._handleWebSocketMessage(event);
    }
}