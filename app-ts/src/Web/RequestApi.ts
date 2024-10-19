import { SelectCharacterState } from "../ValueObject/Character";


export class RequestAPI {
    private static _port: Number = 8010;
    static set port(port: Number) { this._port = port; }
    static get port() { return this._port; }
    requestinit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    static get rootURL(): string {
        return `http://localhost:${this.port}/`;
    }


    async fetchOnDecideCharaInfo(humanNameState: SelectCharacterState) {
        //キャラインフォが決まったときに呼びdして、サーバーにキャラインフォを送り、ボイスロイドを起動して、画像データを取得する。

        //1. jsonに変換する
        const data = JSON.stringify(humanNameState.toDict());
        //2. 非同期fetchする
        const response = await fetch(RequestAPI.rootURL + "DecideCharaInfo", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).then(response => response.json())
        .then(json => {
            console.log(json);
        });
        //3. レスポンスを加工する
        //4. レスポンスを返す

    }


}