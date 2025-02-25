
import google.generativeai as genai
from api.DataStore.JsonAccessor import JsonAccessor


class GeminiAPIUnit:
    def __init__(self):
        self.api_key = JsonAccessor.loadGeminiAPIKey()
        genai.configure(api_key=self.api_key)

    def modelList(self):
        return genai.list_models()