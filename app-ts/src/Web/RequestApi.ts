import { SelectCharacterState, SelectCharacterStateReq } from "../ValueObject/Character";


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


    static async fetchOnDecideCharaInfo(humanNameState: SelectCharacterState) {
        //キャラインフォが決まったときに呼びdして、サーバーにキャラインフォを送り、ボイスロイドを起動して、画像データを取得する。
        let req = new SelectCharacterStateReq(humanNameState, this.client_id);

        //1. jsonに変換する
        const data = JSON.stringify(req.toDict());
        console.log(data);
        //2. 非同期fetchする
        const response = await fetch(RequestAPI.rootURL + "DecideChara", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => response.json())
        .then(json => {
                console.log(json);
                return json;
            })
        .catch((error) => {
                console.error('Error:', error);
            });
        return response;

    }


}