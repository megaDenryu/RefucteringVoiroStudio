import enum
from google.genai import types

class GoogleSearchTool設定候補(enum.Enum):
    検索結果 = "検索結果"
    retrieval = "retrieval"
    両方 = "両方"

class GoogleSearchTool:
    @staticmethod
    def 設定(setting:GoogleSearchTool設定候補):
        google_search_tool:types.Tool
        if setting == GoogleSearchTool設定候補.検索結果:
            google_search_tool = types.Tool(
                google_search= types.GoogleSearch()
            )
        elif setting == GoogleSearchTool設定候補.retrieval:
            # こいつはgemini-2.0-flashではまだ対応してないらしい
            google_search_tool = types.Tool(
                google_search_retrieval = types.GoogleSearchRetrieval(
                    dynamic_retrieval_config=types.DynamicRetrievalConfig(mode=types.DynamicRetrievalConfigMode.MODE_UNSPECIFIED)
                )
            )
        elif setting == GoogleSearchTool設定候補.両方:
            google_search_tool = types.Tool(
                google_search= types.GoogleSearch(),
                google_search_retrieval = types.GoogleSearchRetrieval(
                    dynamic_retrieval_config=types.DynamicRetrievalConfig(mode=types.DynamicRetrievalConfigMode.MODE_UNSPECIFIED)
                )
            )
        else:
            raise Exception("settingが不正です")
        return google_search_tool