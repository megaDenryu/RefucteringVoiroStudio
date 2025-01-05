import asyncio
import os
import random
import sys
from pathlib import Path

from fastapi.exceptions import RequestValidationError
from api.DataStore.AppSetting.AppSettingModel.AppSettingInitReq import AppSettingInitReq
from api.DataStore.AppSetting.AppSettingModel.AppSettingModel import AppSettingsModel
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.CevioAIVoiceSettingModel import CevioAIVoiceSettingModel
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.CevioAIVoiceSettingModelReq import CevioAIVoiceSettingModelReq
from api.DataStore.ChatacterVoiceSetting.CevioAIVoiceSetting.CevioAIVoiceSettingReq import CevioAIVoiceSettingReq
from api.InstanceManager.InstanceManager import InastanceManager
from api.comment_reciver.TwitchCommentReciever import TwitchBot, TwitchMessageUnit
from api.gptAI.HumanInformation import AllHumanInformationDict, AllHumanInformationManager, CharacterModeState, CharacterName, HumanImage, ICharacterModeState, TTSSoftware, VoiceMode, CharacterId, FrontName
from api.gptAI.gpt import ChatGPT
from api.gptAI.voiceroid_api import TTSSoftwareManager, cevio_human
from api.gptAI.Human import Human
from api.gptAI.AgentManager import AgentEventManager, AgentManager, GPTAgent, LifeProcessBrain
from api.images.image_manager.HumanPart import HumanPart
from api.images.image_manager.IHumanPart import HumanData
from api.images.psd_parser_python.parse_main import PsdParserMain
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
from api.DataStore.JsonAccessor import JsonAccessor
from api.DataStore.AppSetting.AppSettingModule import AppSettingModule, PageMode
from api.Epic.Epic import Epic
from api.DataStore.Memo import Memo

import logging
from enum import Enum

from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Form
from fastapi.encoders import jsonable_encoder
from starlette.websockets import WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


from typing import Dict, List, Any, Literal, TypedDict

import mimetypes

from api.comment_reciver.comment_module import NicoNamaCommentReciever
from api.comment_reciver.newNikonamaCommentReciever import newNikonamaCommentReciever
from api.comment_reciver.NiconamaUserLinkVoiceroidModule import NiconamaUserLinkVoiceroidModule
from api.comment_reciver.YoutubeCommentReciever import YoutubeCommentReciever

from api.web.notifier import Notifier
import json
from pprint import pprint
import datetime
import traceback
from uuid import uuid4
import uvicorn

class CharacterModeStateReq(BaseModel):
    characterModeState: CharacterModeState
    client_id: str

#フォルダーがあるか確認
HumanPart.initalCheck()

app = FastAPI()

# カスタムフォーマッタの定義
class CustomFormatter(logging.Formatter):
    def format(self, record):
        if isinstance(record.msg, dict):
            record.msg = json.dumps(record.msg, ensure_ascii=False, indent=4)
        return super().format(record)

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ファイルハンドラを追加
file_handler = logging.FileHandler("app.log", encoding="utf-8")
file_handler.setLevel(logging.INFO)
formatter = CustomFormatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# CORS設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 許可するオリジンを指定
    allow_credentials=True,
    allow_methods=["*"],  # 許可するHTTPメソッドを指定
    allow_headers=["*"],  # 許可するHTTPヘッダーを指定
)

# 例外ハンドラを追加
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"message": "Validation Error", "details": exc.errors()},
    )

# プッシュ通知各種設定が定義されているインスタンス
notifier = Notifier()
inastanceManager = InastanceManager()

setting_module = AppSettingModule()
#Humanクラスの生成されたインスタンスを登録する辞書を作成
# human_dict:dict[CharacterId,Human] = {}
# gpt_mode_dict = {}
#game_masterのインスタンスを生成
yukarinet_enable = True
nikonama_comment_reciever_list:dict[str,NicoNamaCommentReciever] = {}
new_nikonama_comment_reciever_list:dict[str,newNikonamaCommentReciever] = {}
YoutubeCommentReciever_list:dict[str,YoutubeCommentReciever] = {}
twitchBotList:dict[str,TwitchBot] = {}
# input_reciever = InputReciever(epic ,gpt_agent_dict, gpt_mode_dict)
diary = Memo()


app_setting = JsonAccessor.loadAppSetting()
pprint(app_setting)

# print("アプリ起動完了")
# Websocket用のパス
ExtendFunc.ExtendPrint("ボイスロイドの起動")
# TTSSoftwareManager.tryStartAllTTSSoftware()
# TTSSoftwareManager.updateAllCharaList()
mana = AllHumanInformationManager.singleton()

ExtendFunc.ExtendPrint("ボイスロイドの起動完了")

@app.on_event("startup")
async def startup_event():
    print("Server is starting...")

@app.on_event("shutdown")
async def shutdown_event():
    print("Server is shutting down...")
    # ここに終了処理を書く
    # cevioを起動していたら終了させる
    cevio_shutdowned = False
    for human in inastanceManager.humanInstances.Humans:
        if cevio_shutdowned==False and human.voice_system == "cevio":
            try:
                #human.human_Voice.kill_cevio()
                #human.human_Voice.cevio.shutDown()
                shutdowned = True
            except Exception as e:
                print(e)
                print("cevioを終了できませんでした")
    print("cevioを終了しました")
    exit()
    

@app.websocket("/id_create")
async def create_id(websocket: WebSocket):
    await websocket.accept()
    id = inastanceManager.clientIds.createNewId()
    await websocket.send_text(id)


# この関数が @app.get("./") より上にあるので /app-ts/ はこっちで処理される
@app.get("/app-ts/{path_param:path}")
async def read_app_ts(path_param: str):
    # 現在のディレクトリを取得
    current_dir = Path(__file__).parent
    # appファイルのルートディレクトリを指定
    app_ts_dir = current_dir / 'app-ts/dist'
    print(str(app_ts_dir))

    print(f"{path_param=}")
    target = app_ts_dir / path_param
    if path_param == "":
        target = app_ts_dir / "index.html"
    elif path_param == "newHuman":
        target = app_ts_dir / "index_Human2.html"
    elif path_param == "option":
        target = app_ts_dir / "option.html"
    elif path_param == "test1012":
        target = app_ts_dir / "test1012.html"
    print(f"{target=}")

    # ファイルが存在しない場合は404エラーを返す
    if not target.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # Content-Typeを取得
    content_type, encoding = mimetypes.guess_type(str(target))

    # ファイルを読み込み、Content-Typeとともにレスポンスとして返す
    return FileResponse(str(target), media_type=content_type)

@app.get("/{path_param:path}")
async def read_root(path_param: str):
    # 現在のディレクトリを取得
    current_dir = Path(__file__).parent
    # appファイルのルートディレクトリを指定
    app_dir = current_dir / 'app'
    print(str(app_dir))

    # パスを取得
    print(f"{path_param=}")
    target = app_dir / path_param
    if path_param == "":
        target = app_dir / "index.html"
    
    if path_param == "newHuman":
        target = app_dir / "index_Human2.html"

    if path_param == "MultiHuman":
        # 一つのウインドウに複数のキャラを出すためのページだが、大幅なリファクタが必要そうなので保留
        target = app_dir / "index_MultiHuman.html"
    
    if path_param == "settingPage":
        target = app_dir / "setting.html"

    if path_param == "DevPlayGround":
        target = app_dir / "DevPlayGround.html"

    print(f"{target=}")

    # ファイルが存在しない場合は404エラーを返す
    if not target.exists():
        raise HTTPException(status_code=404, detail="File not found")

    # Content-Typeを取得
    content_type, encoding = mimetypes.guess_type(str(target))

    # ファイルを読み込み、Content-Typeとともにレスポンスとして返す
    return FileResponse(str(target), media_type=content_type)

class CharaCreateData(TypedDict):
    humanData: HumanData
    characterModeState: ICharacterModeState

class MessageUnit(TypedDict):
    text: str
    characterModeState: ICharacterModeState|None

MessageDict = dict[FrontName, MessageUnit]  #FrontName型をstrと仮定。ただしCharacterId型にいずれ変更する。クライアント側の実装と一緒に対応する

class SendData(TypedDict):
    message: MessageDict
    gpt_mode: dict[str,str]

@app.websocket("/ws/{client_id}")
async def websocket_endpoint2(websocket: WebSocket, client_id: str):
    print("リクエスト検知")
    # クライアントとのコネクション確立
    await notifier.connect(websocket)
    inastanceManager.clientWs.setClientWs(client_id, websocket)

    try:
        while True:
            # クライアントからメッセージの受け取り
            datas:SendData = json.loads(await websocket.receive_text()) 
            message:MessageDict = datas["message"]
            recieve_gpt_mode_dict = Human.convertDictKeyToCharName(datas["gpt_mode"])
            # for character_id in recieve_gpt_mode_dict.keys():
            #     inastanceManager.gptModeManager.setCharacterGptMode(character_id, recieve_gpt_mode_dict[character_id])
            input = ""
            input_dict:dict[CharacterId,str] = {}
            json_data = json.dumps(message, ensure_ascii=False)
            #await notifier.push(json_data)
            inputer = ""
            for front_name,message_unit in message.items():
                if message_unit["characterModeState"] == None:
                    continue
                characterModeState = CharacterModeState.fromDict(message_unit["characterModeState"])
                character_id = characterModeState.id
                ExtendFunc.ExtendPrintWithTitle("characterModeState",characterModeState)
                # フロントでのキャラ名で帰ってきてるので、Humanインスタンスのキャラ名に変換
                inastanceManager.humanInstances.updateHumanModeState(characterModeState)

                sentence = f"{characterModeState.character_name.name}:{message_unit} , "
                input_dict[character_id] = message_unit["text"]
                input = input + sentence
                # インプットしたキャラの名前を取得
                if "" != message_unit:
                    inputer = character_id
            print(f"input:{input}")

            #inputerの音声を生成
            for character_id in [inputer]:
                #gptには投げない
                print(f"ユーザー：{character_id}の返答を生成します")
                ExtendFunc.ExtendPrint(character_id)
                human_ai:Human|None = inastanceManager.humanInstances.tryGetHuman(character_id)
                if human_ai == None:
                    ExtendFunc.ExtendPrint(f"{character_id}のHumanインスタンスが存在しません")
                    ExtendFunc.ExtendPrint(f"{inastanceManager.humanInstances.HumanFrontNames=}")
                    continue
                await inastanceManager.epic.appendMessageAndNotify(input_dict)
                print(f"{human_ai.char_name=}")
                if "" != input_dict[character_id]:
                    print(f"{input_dict[character_id]=}")
                    rubi_sentence = inastanceManager.aiRubiConverter.convertAsync(input_dict[character_id])
                    if rubi_sentence == None:
                        return
                    for sentence in Human.parseSentenseList(rubi_sentence):
                        for reciever in nikonama_comment_reciever_list.values():
                            reciever.checkAndStopRecieve(sentence)
                            
                        human_ai.outputWaveFile(sentence)
                        #wavデータを取得
                        wav_info = human_ai.human_Voice.output_wav_info_list
                        #バイナリーをjson形式で送信
                        send_data = {
                            "sentence":{human_ai.front_name:sentence},
                            "wav_info":wav_info,
                            "chara_type":"player"
                        }
                        print(f"{human_ai.char_name}のwavデータを送信します")
                        # await websocket.send_json(json.dumps(wav_info))
                        await websocket.send_json(json.dumps(send_data))
                    # daiaryに保存
                    diary.insertTodayMemo(input_dict[character_id])
            
    # セッションが切れた場合
    except WebSocketDisconnect:
        print("wsエラーです:ws")
        await notifier.connect(websocket)
        await notifier.push("切れたから再接続")
        #ONE.shutDown()
        # 切れたセッションの削除
        notifier.remove(websocket)


# @app.websocket("/old_nikonama_comment_reciver/{room_id}/{front_name}")
# async def old_nicowebsocket_endpoint(websocket: WebSocket, room_id: str, front_name: str):
#     await websocket.accept()
#     char_name = Human.setCharName(front_name)
#     print(f"{char_name}で{room_id}のニコ生コメント受信開始")
#     update_room_id_query = {
#         "ニコ生コメントレシーバー設定": {
#             "生放送URL":room_id
#         }
#     }
#     JsonAccessor.updateAppSettingJson(update_room_id_query)
#     end_keyword = app_setting["ニコ生コメントレシーバー設定"]["コメント受信停止キーワード"]
#     nikonama_comment_reciever = NicoNamaCommentReciever(room_id,end_keyword)
#     nikonama_comment_reciever_list[char_name] = nikonama_comment_reciever
#     nulvm = NiconamaUserLinkVoiceroidModule()

#     async for comment in nikonama_comment_reciever.get_comments():
#         pprint(comment)
#         if "user_id" in comment:
#             user_id = comment["user_id"]
#             if "@" in comment["comment"] or "＠" in comment["comment"]:
#                 print("ユーザーIDとキャラ名を紐づけます")
#                 char_name = nulvm.registerNikonamaUserIdToCharaName(comment["comment"],user_id)

#             comment["char_name"] = nulvm.getCharaNameByNikonamaUser(user_id)
        
#             if "/info 3" in comment["comment"]:
#                 comment["comment"] = comment["comment"].replace("/info 3","")
            
#         await websocket.send_text(json.dumps(comment))

# @app.post("/old_nikonama_comment_reciver_stop/{front_name}")
# async def old_nikonama_comment_reciver_stop(front_name: str):
#     char_name = Human.setCharName(front_name)
#     if char_name in nikonama_comment_reciever_list:
#         print(f"{front_name}のニコ生コメント受信停止")
#         nikonama_comment_reciever = nikonama_comment_reciever_list[char_name]
#         nikonama_comment_reciever.stopRecieve()
#         return

@app.websocket("/nikonama_comment_reciver/{room_id}/{front_name}")
async def nikonama_comment_reciver_start(websocket: WebSocket, room_id: str, front_name: str):
    await websocket.accept()
    char_name = Human.setCharName((front_name))
    print(f"{char_name}で{room_id}のニコ生コメント受信開始")
    update_room_id_query = {
        "ニコ生コメントレシーバー設定": {
            "生放送URL":room_id
        }
    }
    JsonAccessor.updateAppSettingJson(update_room_id_query)
    end_keyword = app_setting["ニコ生コメントレシーバー設定"]["コメント受信停止キーワード"]
    ndgr_client = newNikonamaCommentReciever(room_id, end_keyword)
    new_nikonama_comment_reciever_list[char_name.name] = ndgr_client
    nulvm = NiconamaUserLinkVoiceroidModule()

    async for NDGRComment in ndgr_client.streamComments():
        # 生のユーザー ID が 0 より上だったら生のユーザー ID を、そうでなければ匿名化されたユーザー ID を表示する
        user_id = NDGRComment.raw_user_id if NDGRComment.raw_user_id > 0 else NDGRComment.hashed_user_id
        content = NDGRComment.content
        date = TimeExtend.convertDatetimeToString(NDGRComment.at)

        comment = {
            "user_id": user_id,
            "comment": content,
            "date": date,
        }

        ExtendFunc.ExtendPrint(comment)
        if "@" in comment["comment"] or "＠" in comment["comment"]:
            print("ユーザーIDとキャラ名を紐づけます")
            char_name = nulvm.registerNikonamaUserIdToCharaName(comment["comment"],user_id)
        comment["char_name"] = nulvm.getCharaNameByNikonamaUser(user_id)
        ExtendFunc.ExtendPrint(comment)
        await websocket.send_text(json.dumps(comment))

@app.post("/nikonama_comment_reciver_stop/{front_name}")
async def nikonama_comment_reciver_stop(front_name: str):
    char_name = Human.setCharName(front_name)
    if char_name in nikonama_comment_reciever_list:
        print(f"{front_name}のニコ生コメント受信停止")
        nikonama_comment_reciever = new_nikonama_comment_reciever_list[char_name]
        nikonama_comment_reciever.stopRecieve()
        return
    
@app.websocket("/YoutubeCommentReceiver/{video_id}/{front_name}")
async def getYoutubeComment(websocket: WebSocket, video_id: str, front_name: str):
    print("YoutubeCommentReceiver")
    await websocket.accept()
    char_name = Human.setCharName(front_name)

    try:
        while True:
            datas:dict = await websocket.receive_json()
            start_stop = datas["start_stop"]
            print(f"{front_name=} , {video_id=} , {start_stop=}")
            if start_stop == "start":
                nulvm = NiconamaUserLinkVoiceroidModule()
                print(f"{char_name}で{video_id}のYoutubeコメント受信開始")
                #コメント受信を開始
                ycr = YoutubeCommentReciever(video_id=video_id)
                if char_name == "名前が無効です":
                    ExtendFunc.ExtendPrint("名前が無効です")
                    return
                YoutubeCommentReciever_list[char_name.name] = ycr
                async for comment in ycr.fetch_comments(ycr.video_id):
                    print(f"478:{comment=}") # {'author': 'ぴっぴ', 'datetime': '2024-04-20 16:48:47', 'message': 'はろー'}
                    author = comment["author"]
                    if "@" in comment["message"] or "＠" in comment["message"]:
                        print("authorとキャラ名を紐づけます")
                        char_name = nulvm.registerNikonamaUserIdToCharaName(comment["message"],author)

                    comment["char_name"] = nulvm.getCharaNameByNikonamaUser(author)
                    await websocket.send_text(json.dumps(comment))
            else:
                print(f"{char_name}で{video_id}のYoutubeコメント受信停止")
                if char_name in YoutubeCommentReciever_list:
                    YoutubeCommentReciever_list[char_name].stop()
                    del YoutubeCommentReciever_list[char_name]
                    await websocket.close()
    except WebSocketDisconnect:
        print(f"WebSocket disconnected unexpectedly for {char_name} and {video_id}")
        if char_name in YoutubeCommentReciever_list:
            YoutubeCommentReciever_list[char_name].stop()
            del YoutubeCommentReciever_list[char_name]
class TwitchCommentReceiver(BaseModel):
    video_id: str
    front_name: str

@app.post("/RunTwitchCommentReceiver")
async def runTwitchCommentReceiver(req:TwitchCommentReceiver):
    ExtendFunc.ExtendPrint("ツイッチ開始")
    ExtendFunc.ExtendPrint(req)
    video_id = req.video_id
    front_name = req.front_name
    char_name = Human.setCharName(front_name)
    print(f"{char_name}でTwitchコメント受信開始")
    TWTITCH_ACCESS_TOKEN = TwitchBot.getAccessToken()
    twitchBot = TwitchBot(video_id, TWTITCH_ACCESS_TOKEN)
    twitchBotList[char_name.name] = twitchBot
    twitchBot.run()
    # return {"message":"Twitchコメント受信開始"}

class StopTwitchCommentReceiver(BaseModel):
    front_name: str

@app.post("/StopTwitchCommentReceiver")
async def stopTwitchCommentReceiver(req:StopTwitchCommentReceiver):
    print("Twitchコメント受信停止")
    front_name = req.front_name
    chara_name = Human.setCharName(front_name)
    await twitchBotList[chara_name.name].stop()
    twitchBotList.pop(chara_name.name)
    return {"message":"Twitchコメント受信停止"}

@app.websocket("/TwitchCommentReceiver/{video_id}/{front_name}")
async def twitchCommentReceiver(websocket: WebSocket, video_id: str, front_name: str):
    ExtendFunc.ExtendPrint("TwitchCommentReceiver")
    await websocket.accept()
    char_name = Human.setCharName(front_name)
    message_queue:asyncio.Queue[TwitchMessageUnit] = twitchBotList[char_name.name].message_queue
    nulvm = NiconamaUserLinkVoiceroidModule()
    try:
        while True and char_name in twitchBotList:
            comment = {}
            messageUnit:TwitchMessageUnit = await message_queue.get()
            ExtendFunc.ExtendPrint(f"messageUnit:{messageUnit}")
            message = messageUnit.message
            listener = messageUnit.listner_name
            ExtendFunc.ExtendPrint(f"message:{message}")
            if "@" in message or "＠" in message:
                print("ユーザーIDとキャラ名を紐づけます")
                registered_char_name = nulvm.registerNikonamaUserIdToCharaName(message,listener)
            comment["char_name"] = nulvm.getCharaNameByNikonamaUser(listener)
            comment["comment"] = message
            ExtendFunc.ExtendPrint(comment)
            await websocket.send_text(json.dumps(comment))
            ExtendFunc.ExtendPrint("ツイッチ受信コメントをクライアントに送信完了")
        ExtendFunc.ExtendPrint("TwitchCommentReceiver終了")
    except WebSocketDisconnect:
        ExtendFunc.ExtendPrint(f"WebSocket が切断されました。 for {char_name} and {video_id}")



            


@app.websocket("/InputPokemon")
async def inputPokemon(websocket: WebSocket):
    # クライアントとのコネクション確立
    await notifier.connect(websocket)
    try:
        while True:
            # クライアントからメッセージの受け取り
            data = json.loads(await websocket.receive_text()) 
            # 双方向通信する場合
            #  await websocket.send_text(f"Message text was: {data}")
            # ブロードキャスト
            if type(data) == list:
                for d in data:
                    await notifier.push(f"Message text was: {d}")
            elif type(data) == dict:
                for key in data.keys():
                    await notifier.push(f"Message text was: {data[key]}")
            else:
                print(type(data))
    # セッションが切れた場合
    except WebSocketDisconnect:
        print("wsエラーです:InputPokemon")
        # 切れたセッションの削除
        notifier.remove(websocket)



@app.websocket("/human/{client_id}")
async def human_pict(websocket: WebSocket, client_id: str):
    """
    キャラクターのあだ名を受け取り、キャラクターのパーツの画像のpathを送信する
    """
     # クライアントとのコネクション確立
    print("humanコネクションします")
    await websocket.accept()
    print("humanコネクション完了！")
    try:
        while True:
            print("データ受け取り開始！")
            # クライアントからキャラクター名のメッセージの受け取り
            name_data = await websocket.receive_text()
            print("human:" + name_data)
            
            if Human.setCharName(name_data) == "":
                print("キャラ名が無効です")
                await websocket.send_json(json.dumps("キャラ名が無効です"))
                continue
            chara_mode_state = CharacterModeState.newFromFrontName(name_data)
            #キャラ立ち絵のパーツを全部送信する。エラーがあったらエラーを返す
            try:
                tmp_human = inastanceManager.humanInstances.createHuman(chara_mode_state)
                #clientにキャラクターのパーツのフォルダの画像のpathを送信
                human_part_folder:HumanData = tmp_human.image_data_for_client
                charaCreateData:CharaCreateData = {
                    "humanData":human_part_folder,
                    "characterModeState":chara_mode_state.toDict()
                }
                await websocket.send_json(json.dumps(charaCreateData))
            except Exception as e:
                print(e)
                traceback.print_exc()
                print("キャラ画像送信エラーです")
                await websocket.send_json(json.dumps("キャラ画像送信エラーです"))
    except WebSocketDisconnect:
        print("wsエラーです:human")
        # 切れたセッションの削除
        notifier.remove(websocket)


class Test(BaseModel):
    test_param: str

@app.post("/test")
async def test(req_body: Test):
    print(req_body.test_param)
    return {"message": "testレスポンス"}

class ResponseMode(str, Enum):
    noFrontName_needBodyParts = "noFrontName_needBodyParts"
    FrontName_needBodyParts = "FrontName_needBodyParts"
    FrontName_noNeedBodyParts = "FrontName_noNeedBodyParts"
    

class PsdFile(BaseModel):
    file: UploadFile
    filename: str
    response_mode: ResponseMode
    front_name: str

class ImageData(BaseModel):
    body_parts_iamges: Any
    init_image_info: Any
    front_name: str
    char_name: str


@app.post("/parserPsdFile")
async def parserPsdFile(
    file: UploadFile = File(...), 
    filename: str = Form(...), 
    response_mode: ResponseMode = Form(...), 
    front_name: str = Form(...)
):
    # file_contents = await req_body.file.read()
    # filename = req_body.filename
    # response_mode = req_body.response_mode
    # front_name = req_body.front_name
    file_contents = await file.read()
    print("ファイル受け取り完了")        
    # psdファイルが送られてくるので取得
    chara_name = Human.pickFrontName(filename)
    if chara_name == "名前が無効です":
        return {"message": "ファイル名が無効です。保存フォルダの推測に使うのでファイル名にキャラクター名を1つ含めてください"}
    # ファイルの保存先を指定
    api_dir = Path(__file__).parent.parent.parent / 'api'
    folder_name = f"{filename.split('.')[0]}"
    folder = str(HumanPart.getVoiroCharaImageFolderPath() / chara_name.name / folder_name)

    # 保存先のフォルダが存在するか確認。存在する場合はフォルダ名を変更。ゆかり1,ゆかり2があればゆかり3を作成する感じ。
    file_counter = 0
    while os.path.exists(folder):
        file_counter = file_counter + 1
        folder_name = f"{filename.split('.')[0]}_{file_counter}"
        folder = folder = str(HumanPart.getVoiroCharaImageFolderPath() / chara_name.name / folder_name)
    os.makedirs(folder)
    psd_file = f"{folder}\\{filename}"
    # ファイルの内容を保存
    with open(psd_file, 'wb') as f:
        f.write(file_contents)
    
    # psdファイルをパースして保存
    parser = PsdParserMain(folder,psd_file)
    # CharFilePath.jsonにファイル名を追加
    HumanPart.writeCharFilePathToNewPSDFileName(chara_name,folder_name)
    AllHumanInformationManager.singleton().load()
    
    if response_mode == ResponseMode.noFrontName_needBodyParts or response_mode == ResponseMode.FrontName_needBodyParts:
        # パーツを取得
        human_part = HumanPart(chara_name)
        image_data_for_client, body_parts_pathes_for_gpt = human_part.getHumanAllPartsFromPath(chara_name.name, front_name ,folder)
        charaCreateData:CharaCreateData = {
            "humanData":image_data_for_client,
            "characterModeState":CharacterModeState.newFromFrontName(front_name).toDict()
        }
        
        return charaCreateData
        
    
    elif response_mode == ResponseMode.FrontName_noNeedBodyParts:
        return {"message": "psdファイルを保存しました。"}
    


class PartsPath(BaseModel):
    folder_name: str
    file_name: str

OnomatopeiaMode = Literal["パク", "パチ", "ぴょこ"]
Status = Literal["開候補", "閉"]

class PatiSetting(BaseModel):
    characterModeState:CharacterModeState
    chara_name: str
    front_name: str
    pati_setting: dict#Dict[OnomatopeiaMode, Dict[Status, List[PartsPath]]]
    now_onomatopoeia_action: dict#Dict[OnomatopeiaMode, List[PartsPath]]



@app.post("/pati_setting")
async def pati_setting(req: PatiSetting):
    characterModeState = req.characterModeState
    chara_name = req.chara_name
    front_name = req.front_name
    pati_setting = req.pati_setting
    now_onomatopoeia_action = req.now_onomatopoeia_action
    
    try:
        human:Human = inastanceManager.humanInstances.tryGetHuman(characterModeState.id) or inastanceManager.humanInstances.createHuman(characterModeState)
        human.saveHumanImageCombination(pati_setting,"OnomatopeiaActionSetting")
        human.saveHumanImageCombination(now_onomatopoeia_action,"NowOnomatopoeiaActionSetting")
        return {"message": "オノマトペアクション設定の保存に成功しました"}
    except Exception as e:
        print(e)
        return {"message": "オノマトペアクション設定の保存でエラーが発生しました"}
    
    

@app.websocket("/img_combi_save")
async def ws_combi_img_reciver(websocket: WebSocket):
    # クライアントとのコネクション確立
    print("img_combi_saveコネクションします")
    await notifier.connect(websocket)
    try:
        while True:
            # クライアントからメッセージの受け取り
            data = json.loads(await websocket.receive_text())
            pprint(data)
            #受け取ったデータをjsonに保存する
            if type(data) == dict:
                #受け取ったデータをjsonに保存する
                characterModeState:ICharacterModeState = data["characterModeState"]
                json_data = data["combination_data"]
                human_name = data["chara_name"]
                combination_name = data["combination_name"]
                # human:Human = human_dict[characterModeState["id"]]
                human:Human|None = inastanceManager.humanInstances.tryGetHuman(characterModeState["id"])
                if human == None:
                    return
                #jsonファイルを保存する
                print("jsonファイルを保存します")
                try:
                    human.saveHumanImageCombination(json_data,combination_name)
                    
                    msg = f"jsonファイルの保存に成功しました。"
                    
                except Exception as e:
                    print(e)
                    msg = f"jsonファイルの保存に失敗しました。{e=}"
                print(msg)
    # セッションが切れた場合
    except WebSocketDisconnect:
        print("wsエラーです:ws_combi_img_sender")
        # 切れたセッションの削除
        # notifier.remove(websocket)

@app.websocket("/gpt_mode")
async def ws_gpt_mode(websocket: WebSocket):
    # クライアントとのコネクション確立
    print("gpt_modeコネクションします")
    await websocket.accept()
    try:
        while True:
            # クライアントからメッセージの受け取り
            data = json.loads(await websocket.receive_text())
            recieve_gpt_mode_dict = Human.convertDictKeyToCharName(data)
            #受け取ったデータをjsonに保存する
            for name in recieve_gpt_mode_dict.keys():
                # gpt_mode_dict[name] = recieve_gpt_mode_dict[name]
                inastanceManager.gptModeManager.setCharacterGptMode(name, recieve_gpt_mode_dict[name])
            if inastanceManager.gptModeManager.特定のモードが動いてるか確認("individual_process0501dev"):
                print("individual_process0501devがないので終了します")
                await inastanceManager.inputReciever.stopObserveEpic()
                break
                
            
    # セッションが切れた場合
    except WebSocketDisconnect:
        print("wsを切断:ws_gpt_mode")

@app.websocket("/gpt_routine_test/{front_name}")
async def ws_gpt_routine(websocket: WebSocket, front_name: str):
    # クライアントとのコネクション確立
    print("gpt_routineコネクションします")
    # await websocket.accept()
    # chara_name = Human.setCharName(front_name)
    # if chara_name not in human_dict:
    #     return
    # human = human_dict[chara_name]
    # human_gpt_manager = AgentManager(chara_name, epic)
    # while True:
    #     if gpt_mode_dict[chara_name] == "individual_process0501dev":
    #         start_time_second = TimeExtend()
    #         message_memory = human_gpt_manager.message_memory
    #         latest_message_time = human_gpt_manager.latest_message_time
    #         message = human_gpt_manager.joinMessageMemory(message_memory)
    #         think_agent_response = human_gpt_manager.think_agent.run(message)
    #         if human_gpt_manager.isThereDiffNumMemory(latest_message_time):
    #             continue
    #         serif_agent_response = await human_gpt_manager.serif_agent.run(think_agent_response)
    #         if human_gpt_manager.isThereDiffNumMemory(latest_message_time):
    #             continue
    #         serif_list = human_gpt_manager.serif_agent.getSerifList(serif_agent_response)
    #         for serif_unit in serif_agent_response:
    #             send_data = human_gpt_manager.createSendData(serif_unit, human)
    #             await websocket.send_json(send_data)
    #             # 区分音声の再生が完了したかメッセージを貰う
    #             end_play = await websocket.receive_json()
    #             # 区分音声の再生が完了した時点で次の音声を送る前にメモリが変わってるかチェックし、変わっていたら次の音声を送らない。
    #             if human_gpt_manager.isThereDiffNumMemory(latest_message_time):
    #                 human_gpt_manager.modifyMemory()
    #                 break
    #         else:
    #             # forが正常に終了した場合はelseが実行されて、メモリ解放処理を行う
    #             human_gpt_manager.message_memory = []

@app.websocket("/gpt_routine2/{front_name}")
async def ws_gpt_event_start2(websocket: WebSocket, req: CharacterModeStateReq):
    # クライアントとのコネクション確立
    print("gpt_routine2コネクションします")
    await websocket.accept()
    human = inastanceManager.humanInstances.tryGetHuman(req.characterModeState.id)
    if human == None:
        ExtendFunc.ExtendPrint(f"{req.characterModeState.id}のHumanインスタンスが存在しません")
        return
    
    # agenet_event_manager = AgentEventManager(human, inastanceManager)
    # agenet_manager = AgentManager(human, epic, human_dict, websocket, input_reciever)
    # gpt_agent = GPTAgent(agenet_manager, agenet_event_manager)
    # gpt_agent_dict[chara_name] = gpt_agent
    gptAgent = inastanceManager.gptAgentInstanceManager.createGPTAgent(human, websocket)
    pipe = inastanceManager.agentPipeManager.createPipeVer2(gptAgent)
    # pipeが完了したら通知
    await pipe
    ExtendFunc.ExtendPrint("gpt_routine終了")


@app.websocket("/gpt_routine/{front_name}")
async def ws_gpt_event_start(websocket: WebSocket, req: CharacterModeStateReq):
    # クライアントとのコネクション確立
    print("gpt_routineコネクションします")
    await websocket.accept()
    human = inastanceManager.humanInstances.tryGetHuman(req.characterModeState.id)
    if human == None:
        ExtendFunc.ExtendPrint(f"{req.characterModeState.id}のHumanインスタンスが存在しません")
        return
    
    gptAgent = inastanceManager.gptAgentInstanceManager.createGPTAgent(human, websocket)
    pipe = inastanceManager.agentPipeManager.createPipeVer0(gptAgent)

    # pipeが完了したら通知
    await pipe
    ExtendFunc.ExtendPrint("gpt_routine終了")

@app.websocket("/gpt_routine3/{front_name}")
async def wsGptGraphEventStart(websocket: WebSocket, req: CharacterModeStateReq):
    # クライアントとのコネクション確立
    print("gpt_routineコネクションします")
    await websocket.accept()
    human = inastanceManager.humanInstances.tryGetHuman(req.characterModeState.id)
    if human == None:
        ExtendFunc.ExtendPrint(f"{req.characterModeState.id}のHumanインスタンスが存在しません")
        return

    gptAgent = inastanceManager.gptAgentInstanceManager.createGPTAgent(human, websocket)
    gptBrain = inastanceManager.agentPipeManager.createLifeProcessBrain(gptAgent)
    pipe = inastanceManager.agentPipeManager.createPipeVer3(gptBrain)

    # pipeが完了したら通知
    await pipe
    ExtendFunc.ExtendPrint("gpt_routine終了")

"""
# 問題
1. ページにアクセスすると、キャラクターを選択しないといけないが、今まではあだ名を入力して召喚していたが、キャラクターをプルダウンで選べるようにもする。
"""
@app.post("/AllCharaInfoTest")
async def AllCharaInfoTest():
    ExtendFunc.ExtendPrint("AllCharaInfoTest")
    return {"message": "AllCharaInfoTest"}

@app.post("/AllCharaInfo")
async def AllCharaInfo():
    TTSSoftwareManager.updateAllCharaList()
    AllHumanInformationManager.singleton().load() #変更があるかもしれないのでリロード
    mana = AllHumanInformationDict()
    ExtendFunc.ExtendPrint(mana)
    # mana.save()
    return mana



@app.post("/DecideChara")
async def DecideChara(req: CharacterModeStateReq):
    character_mode_state:CharacterModeState = req.characterModeState
    client_id = req.client_id
    #name_dataに対応したHumanインスタンスを生成
    tmp_human = inastanceManager.humanInstances.createHuman(character_mode_state)
    #clientにキャラクターのパーツのフォルダの画像のpathを送信
    human_part_folder:HumanData = tmp_human.image_data_for_client
    charaCreateData:CharaCreateData = {
        "humanData":human_part_folder,
        "characterModeState":character_mode_state.toDict()
    }
    ret_data = json.dumps(charaCreateData)
    return ret_data


class Item(BaseModel):
    type: str
    data: str
@app.post("/ShortCut")
async def receive_data(item: Item):
    print("ShortCut")
    pprint(item)



# ブロードキャスト用のAPI
@app.get("/push/{message}")
async def push_to_connected_websockets(message: str):
    # ブロードキャスト
    print("ブロードキャスト")
    await notifier.push(f"! Push notification: {message} !")

# サーバ起動時の処理
@app.on_event("startup")
async def startup():
    # プッシュ通知の準備
    await notifier.generator.asend(None)

@app.post("/appSettingInit")
async def appSettingInit(appSettingInitReq: AppSettingInitReq):
    saveData:dict = JsonAccessor.loadAppSettingTest()
    appSetting = AppSettingsModel(**saveData)
    return appSetting

@app.post("/SaveSetting")
async def saveSetting(saveSettingReq: AppSettingsModel):
    try:
        ExtendFunc.ExtendPrint(saveSettingReq)
        JsonAccessor.saveAppSettingTest(saveSettingReq)
        # 処理ロジック
        return {"message": "設定を保存しました"}
    except Exception as e:
        logger.error(f"Error in /SaveSetting: {e}")
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
    
@app.post("/CevioAIVoiceSettingInit")
async def cevioAIVoiceSettingInit(cevioAIVoiceSettingReq: CevioAIVoiceSettingReq):
    # todo :cevioにアクセスして、ボイスの設定を取得
    human:Human|None = inastanceManager.humanInstances.tryGetHuman(cevioAIVoiceSettingReq.character_id)
    if human == None:
        return
    cevio = human.human_Voice
    #cevio_human かどうかの判定
    if isinstance(cevio, cevio_human):
        cevioAIVoiceSetting = CevioAIVoiceSettingModel(
            talker2V40=cevio.talker2V40,
            talkerComponentArray2=cevio.Components
        )
        return cevioAIVoiceSetting
    
@app.post("/CevioAIVoiceSetting")
async def cevioAIVoiceSetting(req: CevioAIVoiceSettingModelReq):
    ExtendFunc.ExtendPrint(req)
    # todo :cevioにアクセスして、ボイスの設定を保存
    human:Human|None = inastanceManager.humanInstances.tryGetHuman(req.character_id)
    if human == None:
        return
    cevio = human.human_Voice
    #cevio_human かどうかの判定
    if isinstance(cevio, cevio_human):

        cevio.setTalker2V40(req.cevio_ai_voice_setting.talker2V40)
        cevio.setComponents(req.cevio_ai_voice_setting.talkerComponentArray2)
        return {"message": "CevioAIVoiceSettingを保存しました"}
    

    
    

# 設定の状態を取得、管理、配信するAPI
@app.websocket("/settingStore/{client_id}/{setting_name}/{mode_name}")
async def settingStore(websocket: WebSocket, setting_name: str, mode_name:PageMode, client_id: str):
    print("settingStoreコネクションします")
    await websocket.accept()
    setting_module.addWs(setting_name, mode_name, client_id, websocket)
    try:
        while True:
            # クライアントからメッセージの受け取り
            data = await websocket.receive_json()
            pprint(data)
            #受け取ったデータをjsonに保存する
            if type(data) != dict:
                print("データがdict型ではありません")
                continue
            new_setting = setting_module.setSetting(setting_name, mode_name, data, {})
            await setting_module.notify(new_setting, setting_name)

    # セッションが切れた場合
    except WebSocketDisconnect:
        print("wsエラーです:settingStore")






if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8010, lifespan="on")
