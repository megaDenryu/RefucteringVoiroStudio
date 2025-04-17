from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.インターフェース.Iキャラ依存思考モデル import Iキャラ依存思考モデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.創造的連想モデル.創造的連想モジュール import 創造的連想モジュール
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.専門家が結論を出すモデル.専門家が結論を出すモデル import 専門家が結論を出すモデル
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.思考モジュール種類 import ThinkingModuleEnum
from api.LLM.エージェント.会話用エージェント.自立型Ver1.体.BrainModule.脳内思考プロセス.思考モジュール.深層的自問自答モデル.自問自答実行モジュール import 自問自答モジュール


class 思考モデルファクトリー:
    @classmethod
    def 作成(cls, 思考モデル名: ThinkingModuleEnum) -> Iキャラ依存思考モデル:
        if 思考モデル名 == ThinkingModuleEnum.深層的自問自答モデル:
            return 自問自答モジュール()
        elif 思考モデル名 == ThinkingModuleEnum.創造的連想モデル:
            return 創造的連想モジュール()
        elif 思考モデル名 == ThinkingModuleEnum.脳内専門家会議モデル:
            return 専門家が結論を出すモデル()
        