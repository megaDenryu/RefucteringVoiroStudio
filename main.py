import asyncio
import os
import random
import sys
from pathlib import Path

from fastapi.concurrency import asynccontextmanager
from fastapi.exceptions import RequestValidationError
import httpx
from api.DataStore.AppSetting.AppSettingModel.AppSettingInitReq import AppSettingInitReq
from api.DataStore.AppSetting.AppSettingModel.AppSettingModel import AppSettingsModel
from api.DataStore.CharacterSetting.AIVoiceCharacterSettingCollection import AIVoiceCharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.AIVoiceCharacterSettingSaveModelReq import AIVoiceCharacterSettingSaveModelReq
from api.DataStore.CharacterSetting.CevioAICharacterSettingCollection import CevioAICharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.CevioAICharacterSettingSaveModelReq import CevioAICharacterSettingSaveModelReq
from api.DataStore.CharacterSetting.CoeiroinkCharacterSettingCollection import CoeiroinkCharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.CoeiroinkCharacterSettingSaveModelReq import CoeiroinkCharacterSettingSaveModelReq
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingCollection import VoiceVoxCharacterSettingCollectionOperator
from api.DataStore.CharacterSetting.VoiceVoxCharacterSettingSaveModelReq import VoiceVoxCharacterSettingSaveModelReq
from api.InstanceManager.InstanceManager import InastanceManager
from api.comment_reciver.TwitchCommentReciever import TwitchBot, TwitchMessageUnit
from api.gptAI.GPTMode import GPTModeReq, GptMode
from api.gptAI.HumanInfoValueObject import NickName
from api.gptAI.HumanInformation import AllHumanInformationDict, AllHumanInformationManager, CharacterModeState, CharacterName, HumanImage, ICharacterModeState, TTSSoftware, VoiceMode, CharacterId
from api.gptAI.VoiceInfo import SentenceInfo, SentenceOrWavSendData
from api.gptAI.gpt import ChatGPT
from api.gptAI.voiceroid_api import AIVoiceHuman, Coeiroink, TTSSoftwareManager, cevio_human, voicevox_human
from api.gptAI.Human import Human
from api.gptAI.AgentManager import AgentEventManager, AgentManager, GPTAgent, LifeProcessBrain
from api.images.image_manager.HumanPart import HumanPart
from api.images.image_manager.IHumanPart import HumanData
from api.images.psd_parser_python.parse_main import PsdParserMain
from api.Extend.ExtendFunc import ExtendFunc, TimeExtend
from api.DataStore.JsonAccessor import JsonAccessor
from api.DataStore.AppSetting.AppSettingModule import AppSettingModule, PageMode, SettingMode
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

@asynccontextmanager
async def lifespan(app: FastAPI):
    # サーバ起動時の処理
    print("Server is starting...")
    await notifier.generator.asend(None)
    
    yield
    
    # サーバ終了時の処理
    print("Server is shutting down...")
    cevio_shutdowned = False
    for human in inastanceManager.humanInstances.Humans:
        if cevio_shutdowned == False and human.voice_system == "cevio":
            try:
                # human.human_Voice.kill_cevio()
                # human.human_Voice.cevio.shutDown()
                cevio_shutdowned = True
            except Exception as e:
                print(e)
                print("cevioを終了できませんでした")
    print("cevioを終了しました")
    exit()

app = FastAPI(lifespan=lifespan)



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

# ExtendFunc.ExtendPrint("ボイスロイドの起動")
# TTSSoftwareManager.tryStartAllTTSSoftware()
# TTSSoftwareManager.updateAllCharaList()
# mana = AllHumanInformationManager.singleton()
# ExtendFunc.ExtendPrint("ボイスロイドの起動完了")

# プッシュ通知各種設定が定義されているインスタンス
notifier = Notifier()
inastanceManager = InastanceManager.singleton()
#Humanクラスの生成されたインスタンスを登録する辞書を作成
# human_dict:dict[CharacterId,Human] = {}
# gpt_mode_dict = {}
#game_masterのインスタンスを生成
yukarinet_enable = True
nikonama_comment_reciever_list:dict[CharacterId,NicoNamaCommentReciever] = {}
new_nikonama_comment_reciever_list:dict[CharacterId,newNikonamaCommentReciever] = {}
YoutubeCommentReciever_list:dict[CharacterId,YoutubeCommentReciever] = {}
twitchBotList:dict[CharacterId,TwitchBot] = {}
# input_reciever = InputReciever(epic ,gpt_agent_dict, gpt_mode_dict)
diary = Memo()


app_setting = JsonAccessor.loadAppSetting()
pprint(app_setting)

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
    elif path_param == "AppVoiroStudio":
        target = app_ts_dir / "AppVoiroStudio.html"
    elif path_param == "AppSetting":
        target = app_ts_dir / "AppSetting.html"
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

MessageDict = dict[CharacterId, MessageUnit]  #FrontName型をstrと仮定。ただしCharacterId型にいずれ変更する。クライアント側の実装と一緒に対応する

class SendData(TypedDict):
    message: MessageDict

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
            input_dict:dict[CharacterId,str] = {}
            inputer = ""
            for message_unit in message.values():
                if message_unit["characterModeState"] == None:
                    continue
                characterModeState = CharacterModeState.fromDict(message_unit["characterModeState"])
                character_id = characterModeState.id
                ExtendFunc.ExtendPrintWithTitle("characterModeState",characterModeState)
                # フロントでのキャラ名で帰ってきてるので、Humanインスタンスのキャラ名に変換
                inastanceManager.humanInstances.updateHumanModeState(characterModeState)
                input_dict[character_id] = message_unit["text"]
                # インプットしたキャラの名前を取得
                inputer = character_id
            #inputerの音声を生成
            for character_id in [inputer]:
                human_ai:Human|None = inastanceManager.humanInstances.tryGetHuman(character_id)
                if human_ai == None:
                    ExtendFunc.ExtendPrintWithTitle(f"{character_id}のHumanインスタンスが存在しません",f"{inastanceManager.humanInstances.HumanFrontNames=}")
                    continue
                await inastanceManager.epic.appendMessageAndNotify(input_dict)
                if "" != input_dict[character_id]:
                    print(f"{input_dict[character_id]=}")
                    rubi_sentence = await human_ai.aiRubiConverter.convertAsync(input_dict[character_id])
                    if rubi_sentence == None:
                        return
                    for sentence in Human.parseSentenseList(rubi_sentence):
                        for reciever in nikonama_comment_reciever_list.values():
                            reciever.checkAndStopRecieve(sentence)
                            
                        human_ai.outputWaveFile(sentence)
                        #wavデータを取得
                        wav_info = human_ai.human_Voice.output_wav_info_list
                        sentence_info:list[SentenceInfo] = [{
                                "characterModeState":human_ai.chara_mode_state.toDict(),
                                "sentence":sentence
                                }]
                        #バイナリーをjson形式で送信
                        send_data:SentenceOrWavSendData = {
                            "sentence":sentence_info,
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

@app.websocket("/nikonama_comment_reciver/{room_id}/{characterId}")
async def nikonama_comment_reciver_start(websocket: WebSocket, room_id: str, characterId: CharacterId):
    await websocket.accept()
    ExtendFunc.ExtendPrint(f"{inastanceManager.humanInstances.tryGetHuman(characterId)}で{room_id}のニコ生コメント受信開始")
    update_room_id_query = {
        "ニコ生コメントレシーバー設定": {
            "生放送URL":room_id
        }
    }
    JsonAccessor.updateAppSettingJson(update_room_id_query)
    end_keyword = app_setting["ニコ生コメントレシーバー設定"]["コメント受信停止キーワード"]
    ndgr_client = newNikonamaCommentReciever(room_id, end_keyword)
    new_nikonama_comment_reciever_list[characterId] = ndgr_client
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

@app.post("/nikonama_comment_reciver_stop/{characterId}")
async def nikonama_comment_reciver_stop(characterId: CharacterId):
    if characterId in nikonama_comment_reciever_list:
        print(f"{characterId}のニコ生コメント受信停止")
        nikonama_comment_reciever = new_nikonama_comment_reciever_list[characterId]
        nikonama_comment_reciever.stopRecieve()
        return
    
@app.websocket("/YoutubeCommentReceiver/{video_id}/{characterId}")
async def getYoutubeComment(websocket: WebSocket, video_id: str, characterId: CharacterId):
    print("YoutubeCommentReceiver")
    await websocket.accept()

    try:
        while True:
            datas:dict = await websocket.receive_json()
            start_stop = datas["start_stop"]
            if start_stop == "start":
                nulvm = NiconamaUserLinkVoiceroidModule()
                ExtendFunc.ExtendPrint(f"{inastanceManager.humanInstances.tryGetHuman(characterId)}で{video_id}のYoutubeコメント受信開始")
                #コメント受信を開始
                ycr = YoutubeCommentReciever(video_id=video_id)
                YoutubeCommentReciever_list[characterId] = ycr
                async for comment in ycr.fetch_comments(ycr.video_id):
                    print(f"478:{comment=}") # {'author': 'ぴっぴ', 'datetime': '2024-04-20 16:48:47', 'message': 'はろー'}
                    author = comment["author"]
                    if "@" in comment["message"] or "＠" in comment["message"]:
                        print("authorとキャラ名を紐づけます")
                        char_name = nulvm.registerNikonamaUserIdToCharaName(comment["message"],author)

                    comment["char_name"] = nulvm.getCharaNameByNikonamaUser(author)
                    await websocket.send_text(json.dumps(comment))
            else:
                ExtendFunc.ExtendPrint(f"{inastanceManager.humanInstances.tryGetHuman(characterId)}で{video_id}のYoutubeコメント受信停止")
                if characterId in YoutubeCommentReciever_list:
                    YoutubeCommentReciever_list[characterId].stop()
                    del YoutubeCommentReciever_list[characterId]
                    await websocket.close()
    except WebSocketDisconnect:
        print(f"WebSocket disconnected unexpectedly for {characterId} and {video_id}")
        if characterId in YoutubeCommentReciever_list:
            YoutubeCommentReciever_list[characterId].stop()
            del YoutubeCommentReciever_list[characterId]
class TwitchCommentReceiver(BaseModel):
    video_id: str
    characterId: CharacterId

@app.post("/RunTwitchCommentReceiver")
async def runTwitchCommentReceiver(req:TwitchCommentReceiver):
    ExtendFunc.ExtendPrint("ツイッチ開始")
    ExtendFunc.ExtendPrint(req)
    video_id = req.video_id
    characterId = req.characterId
    ExtendFunc.ExtendPrint(f"{inastanceManager.humanInstances.tryGetHuman(characterId)}でTwitchコメント受信開始")
    TWTITCH_ACCESS_TOKEN = TwitchBot.getAccessToken()
    twitchBot = TwitchBot(video_id, TWTITCH_ACCESS_TOKEN)
    twitchBotList[characterId] = twitchBot
    twitchBot.run()
    # return {"message":"Twitchコメント受信開始"}

class StopTwitchCommentReceiver(BaseModel):
    characterId: CharacterId

@app.post("/StopTwitchCommentReceiver")
async def stopTwitchCommentReceiver(req:StopTwitchCommentReceiver):
    print("Twitchコメント受信停止")
    characterId = req.characterId
    await twitchBotList[characterId].stop()
    twitchBotList.pop(characterId)
    return {"message":"Twitchコメント受信停止"}

@app.websocket("/TwitchCommentReceiver/{video_id}/{characterId}")
async def twitchCommentReceiver(websocket: WebSocket, video_id: str, characterId: CharacterId):
    ExtendFunc.ExtendPrint("TwitchCommentReceiver")
    await websocket.accept()
    message_queue:asyncio.Queue[TwitchMessageUnit] = twitchBotList[characterId].message_queue
    nulvm = NiconamaUserLinkVoiceroidModule()
    try:
        while True and characterId in twitchBotList:
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
        ExtendFunc.ExtendPrint(f"WebSocket が切断されました。 for {inastanceManager.humanInstances.tryGetHuman(characterId)} and {video_id}")

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

class InputNickNameSendData(BaseModel):
    nick_name: NickName
    characterId: CharacterId

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
            data = json.loads(await websocket.receive_text())
            ExtendFunc.ExtendPrint(data)
            inputNickNameSendData:InputNickNameSendData = InputNickNameSendData(**data)
            if Human.setCharName(inputNickNameSendData.nick_name.name) == "":
                print("キャラ名が無効です")
                await websocket.send_json(json.dumps("キャラ名が無効です"))
                continue
            chara_mode_state = CharacterModeState.newFromFrontName(inputNickNameSendData.nick_name.name,inputNickNameSendData.characterId)
            #キャラ立ち絵のパーツを全部送信する。エラーがあったらエラーを返す
            try:
                tmp_human = inastanceManager.humanInstances.createHuman(chara_mode_state)
                tmp_human.aiRubiConverter.setMode(inastanceManager.appSettingModule.setting.セリフ設定.AIによる文章変換)
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

class CharaCreateDataResponse(TypedDict):
    succese_mode: Literal["成功","名前が無効","名前を指定してください"]
    message: str
    charaCreateData: CharaCreateData|None


@app.post("/parserPsdFile")
async def parserPsdFile(
    file: UploadFile = File(...), 
    filename: str = Form(...), 
    response_mode: ResponseMode = Form(...), 
    front_name: str = Form(...),
    characterId: CharacterId = Form(...)
):
    
    file_contents = await file.read()
    print("ファイル受け取り完了")        
    # psdファイルが送られてくるので取得
    chara_name = Human.pickFrontName(filename)
    if chara_name == "名前が無効です":
        respose:CharaCreateDataResponse = {"succese_mode":"名前が無効" ,"message": "ファイル名が無効です。保存フォルダの推測に使うのでファイル名にキャラクター名を1つ含めてください", "charaCreateData": None}
        return respose
    # ファイルの保存先を指定
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
    
    human_image = HumanImage(folder_name=folder_name)
    # psdファイルをパースして保存
    parser = PsdParserMain(folder,psd_file)
    # CharFilePath.jsonにファイル名を追加
    HumanPart.writeCharFilePathToNewPSDFileName(chara_name,human_image)
    AllHumanInformationManager.singleton().load()
    
    if response_mode == ResponseMode.noFrontName_needBodyParts or response_mode == ResponseMode.FrontName_needBodyParts:
        # パーツを取得
        human_part = HumanPart(chara_name,human_image)
        if front_name == "????":
            image_data_for_client, body_parts_pathes_for_gpt = human_part.getHumanAllPartsFromPath(chara_name, chara_name.name ,folder)
            charaCreateData:CharaCreateData = {
                "humanData":image_data_for_client,
                "characterModeState":CharacterModeState.newFromFrontName(chara_name.name,characterId).toDict()
            }
        else:
            ExtendFunc.ExtendPrint(f"{front_name=}")
            image_data_for_client, body_parts_pathes_for_gpt = human_part.getHumanAllPartsFromPath(chara_name, front_name ,folder)
            charaCreateData:CharaCreateData = {
                "humanData":image_data_for_client,
                "characterModeState":CharacterModeState.newFromFrontName(front_name,characterId).toDict()
            }
        response:CharaCreateDataResponse = {
            "succese_mode": "成功",
            "message": "psdファイルを保存しました。",
            "charaCreateData": charaCreateData
        }
        ExtendFunc.ExtendPrint(response)
        return response
        
    
    elif response_mode == ResponseMode.FrontName_noNeedBodyParts:
        respose:CharaCreateDataResponse = {"succese_mode":"名前を指定してください" ,"message": "psdファイルを保存しました。", "charaCreateData": None}
        return respose
    


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


@app.post("/gpt_mode")
async def post_gpt_mode(req: GPTModeReq):
    ExtendFunc.ExtendPrintWithTitle("gpt_mode",req)
    inastanceManager.gptModeManager.setCharacterGptMode(req.characterId, req.gptMode)
    if inastanceManager.gptModeManager.特定のモードが動いてるか確認(GptMode.individual_process0501dev):
        print("individual_process0501devがないので終了します")
        ExtendFunc.ExtendPrint( {"message": "individual_process0501devがないので終了します"})
    ExtendFunc.ExtendPrint({"message": f"{req.gptMode.value}の変更に成功しました"})

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


@app.websocket("/gpt_routine/{characterId}")
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

@app.websocket("/gpt_routine3/{characterId}")
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
        return json.dumps({"message": "設定を保存しました"})
    except Exception as e:
        logger.error(f"Error in /SaveSetting: {e}")
        return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
    
# 設定の状態を取得、管理、配信するAPI
@app.websocket("/settingStore/{client_id}/{setting_mode}/{page_mode}")
async def settingStore(websocket: WebSocket, setting_mode: SettingMode, page_mode:PageMode, client_id: str):
    print(f"settingStoreコネクションします")
    setting_module = inastanceManager.appSettingModule
    await websocket.accept()
    setting_module.addWs(setting_mode, page_mode, client_id, websocket)
    try:
        while True:
            # クライアントからメッセージの受け取り
            data = await websocket.receive_json()
            saveSettingReq = AppSettingsModel(**data)
            new_setting:AppSettingsModel = setting_module.setSetting(setting_mode, page_mode, client_id, saveSettingReq)
            # 設定の変更を適用
            for human in inastanceManager.humanInstances.Humans:
                human.aiRubiConverter.setMode(new_setting.セリフ設定.AIによる文章変換)
                ttsSoftware = human.human_Voice #TTSソフトウェアのインスタンス.まだ使うことはないが将来使うかもしれないので取得しておく
            await setting_module.notify(new_setting, setting_mode, "Chat", client_id)
            await setting_module.notify(new_setting, setting_mode, "Setting", client_id)

    # セッションが切れた場合
    except WebSocketDisconnect:
        print(f"wsエラーです:settingStore : {setting_mode=}, {page_mode=}, {client_id=}, {websocket=}")
        ExtendFunc.ExtendPrint(setting_module)
        setting_module.removeWs(setting_mode, page_mode, client_id)
        ExtendFunc.ExtendPrint(setting_module)

@app.post("/CevioAICharacterSetting")
async def cevioAICharacterSetting(req: CevioAICharacterSettingSaveModelReq):
    ExtendFunc.ExtendPrint(req)
    # todo :cevioにアクセスして、キャラクターの設定を保存
    human:Human|None = inastanceManager.humanInstances.tryGetHuman(req.character_id)
    if human == None:
        return
    human.aiRubiConverter.setMode(req.cevioAICharacterSettingModel.readingAloud.AIによる文章変換)
    cevio = human.human_Voice
    #cevio_human かどうかの判定
    if isinstance(cevio, cevio_human):
        cevio.setVoiceSetting(req.cevioAICharacterSettingModel.voiceSetting)
        CevioAICharacterSettingCollectionOperator.singleton().save(req.cevioAICharacterSettingModel)
        return json.dumps({"message": "CevioAICharacterSettingを保存しました"})
    
@app.post("/AIVoiceCharacterSetting")
async def aiVoiceCharacterSetting(req: AIVoiceCharacterSettingSaveModelReq):
    ExtendFunc.ExtendPrint(req)
    # todo :AIVoiceにアクセスして、キャラクターの設定を保存
    human:Human|None = inastanceManager.humanInstances.tryGetHuman(req.character_id)
    if human == None:
        return
    human.aiRubiConverter.setMode(req.aiVoiceCharacterSettingSaveModel.readingAloud.AIによる文章変換)
    aiVoice = human.human_Voice
    if isinstance(aiVoice, AIVoiceHuman):
        # aiVoice.setVoiceSetting(req.aiVoiceCharacterSettingModel.voiceSetting)
        AIVoiceCharacterSettingCollectionOperator.singleton().save(req.aiVoiceCharacterSettingSaveModel)
        return json.dumps({"message": "AIVoiceCharacterSettingを保存しました"})
    
@app.post("/VoiceVoxCharacterSetting")
async def voiceVoxCharacterSetting(req: VoiceVoxCharacterSettingSaveModelReq):
    ExtendFunc.ExtendPrint(req)
    # todo :VoiceVoxにアクセスして、キャラクターの設定を保存
    human:Human|None = inastanceManager.humanInstances.tryGetHuman(req.character_id)
    if human == None:
        return
    human.aiRubiConverter.setMode(req.voiceVoxCharacterSettingModel.readingAloud.AIによる文章変換)
    ExtendFunc.ExtendPrint(human.aiRubiConverter.mode)
    voiceVox = human.human_Voice
    if isinstance(voiceVox, voicevox_human):
        voiceVox.setVoiceSetting(req.voiceVoxCharacterSettingModel.voiceSetting)
        VoiceVoxCharacterSettingCollectionOperator.singleton().save(req.voiceVoxCharacterSettingModel)
        return json.dumps({"message": "VoiceVoxCharacterSettingを保存しました"})
    
@app.post("/CoeiroinkCharacterSetting")
async def coeiroinkCharacterSetting(req: CoeiroinkCharacterSettingSaveModelReq):
    ExtendFunc.ExtendPrint(req)
    # todo :Coeiroinkにアクセスして、キャラクターの設定を保存
    human:Human|None = inastanceManager.humanInstances.tryGetHuman(req.character_id)
    if human == None:
        return
    human.aiRubiConverter.setMode(req.coeiroinkCharacterSettingModel.readingAloud.AIによる文章変換)
    coeiroink = human.human_Voice
    if isinstance(coeiroink, Coeiroink):
        coeiroink.setVoiceSetting(req.coeiroinkCharacterSettingModel.voiceSetting)
        CoeiroinkCharacterSettingCollectionOperator.singleton().save(req.coeiroinkCharacterSettingModel)
        return json.dumps({"message": "CoeiroinkCharacterSettingを保存しました"})

class CevioAIDefaultVoiceSettingReq(BaseModel):
    page_mode: PageMode
    client_id: str
    character_id: CharacterId

@app.post("/CevioAIDefaultVoiceSetting")
async def cevioAIDefaultVoiceSetting(req: CevioAIDefaultVoiceSettingReq):
    ExtendFunc.ExtendPrint(req)
    human = inastanceManager.humanInstances.tryGetHuman(req.character_id)
    if human == None:
        raise HTTPException(status_code=404, detail="Humanが存在しません")
    cevio = human.human_Voice
    if isinstance(cevio, cevio_human):
        # talkerComponentArray2を取得する
        voiceSetting = cevio.Components
        return voiceSetting.model_dump_json()
    
@app.get("/api/niconico/{path:path}")
async def proxy(path: str, request: Request):
    url = f"https://live.nicovideo.jp/{path}"
    async with httpx.AsyncClient() as client:
        # リクエストヘッダーをコピー
        headers = {k: v for k, v in request.headers.items() if k.lower() not in ['host', 'content-length']}
        response = await client.request(
            request.method,
            url,
            headers=headers,
            cookies=request.cookies,
        )
        return response.content
    
from api.Routers import LaunchTTSSoftware
app.include_router(LaunchTTSSoftware.router)


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8010, lifespan="on")
