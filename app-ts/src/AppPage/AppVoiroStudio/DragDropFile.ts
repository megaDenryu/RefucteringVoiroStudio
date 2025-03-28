/**
 * お部屋の要素を取得する
 * 要素にイベントリスナーをオブジェクトを設定する
 * ファイルを開く
 * サーバーにファイルを送信する
 * 
 * 「要素にドラッグドロップでファイルを受け付けて、ファイルを検査して一致するファイルを取得する」
 */


// class DragDropFile{

//     human_tab: Element
//     human_window: Element
//     human_name: HTMLElement
//     human_images: Element
//     target_voiceroid_front_name: string

//     constructor(human_tab: Element){
//         this.human_tab = human_tab;
//         this.human_window = this.human_tab.getElementsByClassName("human_window")[0];
//         this.human_name = this.human_tab.getFirstHTMLElementByClassName("human_name");
//         this.human_images = this.human_tab.getElementsByClassName("human_images")[0];
//         this.target_voiceroid_front_name = "????";
//         human_tab.addEventListener("click", this);
//         human_tab.addEventListener("drop", this);
//         human_tab.addEventListener("dragover", this);

//     }

//     handleEvent(/** @type {DragEvent}*/event){
//         //これがないと、ドラッグドロップができない
//         event.preventDefault();

//         if(event.type == "click"){
//             console.log("ファイルがドラッグされています。")
//             //POST確認
//             fetch(`http://${GlobalState.localhost}:${GlobalState.port}/test`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({test_param: "testだよ茜ちゃん"})
//             }).then(response => response.json())
//             .then(data => {
//                 console.log(data);
//             })
//         } else if(event.type == "drop"){
//             console.log("ファイルがドロップされました。")
//             // ドロップされたファイルを取得する
//             const files = event.dataTransfer?.files;

//             if (files == undefined) {
//                 console.log("ファイルがありません。フォルダーは受け付けません。");
//                 return;
//             }

//             const response_mode = this.decideResponseMode()
            

//             if (files.length == 1) {
//                 // ファイルが1つだけなら、ファイル名がどのボイロでも、今のウインドウの子のフォルダーに保存する
//                 const file = files[0];
//                 if (file.name.endsWith('.psd')) {
//                     console.log("psdファイルです。サーバーに送ります。")

//                     const formData = new FormData();
//                     formData.append('file', file);
//                     formData.append('filename', file.name);
//                     formData.append("response_mode", response_mode)
//                     formData.append("front_name", this.target_voiceroid_front_name)

//                     console.log(`response_mode: ${response_mode}`)

//                     if (response_mode == "FrontName_needBodyParts") {
//                         console.log("front_nameがあり、かつ、画像が表示されてないなら、サーバーはBodyPartsを返す")
//                         fetch(`http://localhost:${GlobalState.port}/parserPsdFile}`, {
//                             method: 'POST',
//                             body: formData
//                         })
//                         .then(response => response.json())
//                         .then(data => {
//                             //JavaScriptでは、オブジェクトからデータを抽出して新しい変数に格納するために、以下のようにデストラクチャリング（Destructuring）という機能を使用することができます。
//                             const { body_parts_iamges, init_image_info, front_name, char_name } = data;
//                             // これで、dataから各データが新しい変数に格納されます。
//                             // body_parts_iamges, init_image_info, front_name, char_nameという名前の変数が作成され、それぞれに対応するデータが格納されます

//                             /**
//                              * @type {BodyParts}
//                              */
//                             const body_parts = {
//                                 "front_name": front_name,
//                                 "char_name": char_name,
//                                 "body_parts_iamges": body_parts_iamges,
//                                 "init_image_info": init_image_info
//                             }
                            
//                             // registerHumanName(front_name,this.human_tab,this.human_name)
//                             GlobalState.humans_list[body_parts["char_name"]] = new HumanBodyManager2(body_parts,this.human_window)
//                             GlobalState.front2chara_name[body_parts["front_name"]] = body_parts["char_name"]
//                         })
//                         .catch(error => console.error(error));
//                     } else if (response_mode == "FrontName_noNeedBodyParts") {
//                         console.log("front_nameがあり、かつ、画像が表示されているなら、サーバーは何も返さない")
//                         fetch(`http://localhost:${GlobalState.port}/parserPsdFile`, {
//                             method: 'POST',
//                             body: formData
//                         })
//                         .then(response => response.json())
//                         .then(data => {
//                             //JavaScriptでは、オブジェクトからデータを抽出して新しい変数に格納するために、以下のようにデストラクチャリング（Destructuring）という機能を使用することができます。
//                             // const { body_parts_iamges, init_image_info, front_name, char_name } = data;
                            
//                         })
//                         .catch(error => console.error(error));
//                     } else if (response_mode == "noFrontName_needBodyParts") {
//                         console.log("front_nameが空文字列なら、サーバーはファイル名からchar_nameを推測してBodyPartsを返す")
//                         fetch(`http://localhost:${GlobalState.port}/parserPsdFile`, {
//                             method: 'POST',
//                             body: formData
//                         })
//                         .then(response => response.json())
//                         .then(data => {
//                             console.log(data)
//                             const { body_parts_iamges, init_image_info, front_name, char_name } = data;
//                             // これで、dataから各データが新しい変数に格納されます。
//                             // body_parts_images, init_image_info, front_name, char_nameという名前の変数が作成され、それぞれに対応するデータが格納されます

//                             /**
//                              * @type {BodyParts}
//                              */
//                             const body_parts = {
//                                 "front_name": front_name,
//                                 "char_name": char_name,
//                                 "body_parts_iamges": body_parts_iamges,
//                                 "init_image_info": init_image_info
//                             }

//                             registerHumanName(front_name,this.human_tab,this.human_name)
//                             GlobalState.humans_list[body_parts["char_name"]] = new HumanBodyManager2(body_parts,this.human_window)
//                             GlobalState.front2chara_name[body_parts["front_name"]] = body_parts["char_name"]
//                         })
//                         .catch(error => console.error(error));
//                     }
//                 } else if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/gif") {
//                     console.log("画像ファイルです。")
//                     if (file.name.includes("背景")) {
                        
//                         let ELM_bg_image = this.human_window.getElementsByClassName("bg_image")[0];
//                         // 背景画像の場合、ELM_bg_imageの画像を変更する
//                         console.log("背景画像です。")
//                         const reader = new FileReader();
//                         reader.readAsDataURL(file);
//                         reader.onload = () => {
//                             (ELM_bg_image as HTMLImageElement).src = reader.result as string;
//                         }

//                     }
//                 } else if (file.name.endsWith('.json')) {
//                     console.log("jsonファイルです。")
//                     const reader = new FileReader();
//                     reader.readAsText(file);
//                     reader.onload = () => {
//                         const json = JSON.parse(reader.result as string);
//                         console.log(json);
//                         if (json["front_name"]) {
//                             this.setFrontname(json["front_name"]);
//                         }
//                     }
//                 } else if (file.name.endsWith('.csv')) {
//                     console.log("csvファイルです。")
//                     const reader = new FileReader();
//                     reader.readAsText(file);
//                     reader.onload = () => {
//                         const csv = reader.result;
//                         console.log(csv);
//                         //csvの型チェック
//                         try{
//                             if (typeof csv == "string") {
//                                 const sentence_timeline = new sentenceTimeLineCreater(csv); 
//                                 const sentence_timeline_list = sentence_timeline.getSentenceTimeLine();
//                             }
//                         } catch (error) {
//                             console.error(error)
//                         }
                        
//                     }
//                 } else {
//                     console.log("ファイルが適切な形式ではありません。");
//                 }


//             } else if (files.length > 1) {
//                 // ファイルが複数なら、ファイル名がどのボイロでも、今のウインドウの子のフォルダーに保存する

//                 // ファイルの検査。フォルダならdrop_enable=falseにする
//                 for (let i = 0; i < files.length; i++) {
//                     const file = files[i];
//                     this.checkFileType(file);
//                 }
//             }

//             // ファイルの検査。psdか画像ならdrop_enable=trueにする

//         }
//     }

//     /**
//      * 
//      * @returns {string}
//      */
//     getFrontname(){
//         return this.target_voiceroid_front_name;
//     }

//     setFrontname(/** @type {string}*/frontname){
//         this.target_voiceroid_front_name = frontname;
//     }

//     checkFileType(/** @type {File}*/file){
//         const file_type = file.type;
//         if (file_type == "image/png" || file_type == "image/jpeg" || file_type == "image/gif") {
//             return true;
//         } else {
//             return false;
//         }
//     }

    

//     /**
//      * front_nameが空文字列なら、サーバーはファイル名からchar_nameを推測してBodyPartsを返す
//      * front_nameがあり、かつ、画像が表示されてないなら、サーバーはBodyPartsを返す
//      * front_nameがあり、かつ、画像が表示されているなら、サーバーは何も返さない
//      * @returns {"noFrontName_needBodyParts"|"FrontName_needBodyParts"|"FrontName_noNeedBodyParts"}
//      */
//     decideResponseMode(){

//         if (this.target_voiceroid_front_name == "????") {
//             return "noFrontName_needBodyParts"
//         } else {
//             //このhuman_tab内に画像があるかどうかを調べる
//             const human_image_list = this.human_images.getElementsByClassName("human_image");
//             if (human_image_list.length > 0) {
//                 return "FrontName_noNeedBodyParts"
//             } else {
//                 return "FrontName_needBodyParts"
//             }
//         }
//     }



// }


/**
 * @typedef {Object} sentenceTimeLine
 * @property {Number} number
 * @property {String} sentence
 * @property {Number} start_time
 * @property {Number} end_time
 * @property {String} speaker 
 */

class sentenceTimeLineCreater{
    /** @type {string[][]}*/ csv_data
    /** @type {string[]}*/ header
    /** @type {Record<string,number>} */ key_num = {
        '番号': 0,
        'セリフ': 1,
        '開始時間': 2,
        '終了時間': 3,
        '話者': 4
    };
    /** @type {sentenceTimeLine[]} */ sentence_timeline_list
    /** */ 
    constructor(/** @type {string}*/csv){
        this.csv_data = this.csvToArray(csv);
        this.header = this.csv_data[0];
        //headerはkeyが書いてある。keyの番号を確認して更新。
        for (let i = 0; i < this.header.length; i++) {
            this.key_num[this.header[i]] = i;
        }
        const num = this.key_num;
        // 1行目はヘッダーなので、2行目からデータが始まる
        this.sentence_timeline_list = this.csv_data.slice(1).map((line) => {
            return {
                number: Number(line[num['番号']]),
                sentence: line[num['セリフ']],
                start_time: Number(line[num['開始時間']]),
                end_time: Number(line[num['終了時間']]),
                speaker: line[num['話者']]
            }
        });
        
    }

    /**
     * 
     * @param {string} csv 
     * @returns {string[][]}
     */
    csvToArray(/** @type {string}*/csv){
        const lines = csv.split('\n');
        const result: string[][] = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const cells = line.split(',');
            result.push(cells);
        }
        return result;
    }

    /**
     * @return {sentenceTimeLine[]}
     */
    getSentenceTimeLine(){
        return this.sentence_timeline_list;
    }
}