import { CharacterModeState, CharacterModeStateReq } from "../ValueObject/Character";
import { CharaCreateData } from "../ValueObject/IHumanPart";


export class RequestAPI {
    private static _port: string|null = "8010";
    static set port(port: string) { this._port = port; }
    static get port() { 
        if (this._port === null) { throw new Error("port is not set"); }
        return this._port; 
    }

    private static _localhost: string|null = "localhost";
    static set localhost(localhost: string) { this._localhost = localhost; }
    static get localhost() { 
        if (this._localhost === null) { throw new Error("localhost is not set"); }
        return this._localhost; 
    }

    private static _client_id: string|null = null;
    static set client_id(client_id: string) { this._client_id = client_id; }
    static get client_id():string { 
        if (this._client_id === null) { throw new Error("client_id is not set"); }
        return this._client_id; 
    }
    
    requestinit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    static get rootURL(): string {
        return `http://localhost:${this.port}/`;
    }

    private static async post(url, data:object):Promise<Response> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return response;
    }

    public static async postRequest<T extends Record<string, any>>(endPoint:string, object:object):Promise<T> {
        const response = await RequestAPI.post(RequestAPI.rootURL + endPoint, object);
        const json:string = await response.json();
        const retrunObject:T = JSON.parse(json);
        return retrunObject;
    }

    public static async postRequest2<T extends Record<string, any>>(endPoint:string, object:object):Promise<T> {
        const response = await RequestAPI.post(RequestAPI.rootURL + endPoint, object);
        const retrunObject:T = await response.json();
        return retrunObject;
    }

    public static async postRequest3<T extends Record<string, any>>(endPoint:string, object:object):Promise<T> {
        const response = await RequestAPI.post(RequestAPI.rootURL + endPoint, object);
        try {
            const data = await response.json();
            if (typeof data === 'string') {
                return JSON.parse(data) as T;
            }
            return data as T;
        } catch (error) {
            console.error('Response parsing error:', error);
            throw error;
        }
    }

    public static async postFormData<T>(endPoint:string, data: FormData): Promise<T> {
        const response = await fetch(RequestAPI.rootURL + endPoint, {
          method: 'POST',
          body: data
        });
      
        // レスポンスが既にJSONオブジェクトとして返される場合
        const result = await response.json();
        return result as T;
    }

    static async fetchOnDecideCharaInfo(humanNameState: CharacterModeState):Promise<CharaCreateData> {
        //キャラインフォが決まったときに呼びdして、サーバーにキャラインフォを送り、ボイスロイドを起動して、画像データを取得する。
        let req = new CharacterModeStateReq(humanNameState, this.client_id);
        return RequestAPI.postRequest<CharaCreateData>("DecideChara",req.toDict());
    }


}