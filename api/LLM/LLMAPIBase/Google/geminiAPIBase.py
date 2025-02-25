
import google.generativeai as genai
from api.DataStore.JsonAccessor import JsonAccessor


class GeminiAPIUnit:
    def __init__(self, api_key, api_secret, api_url):
        self.api_key = JsonAccessor.loadGeminiAPIKey()

    