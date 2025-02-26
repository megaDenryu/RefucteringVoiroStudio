
from google import genai
import google.generativeai as generativeai
from api.DataStore.JsonAccessor import JsonAccessor

# https://googleapis.github.io/python-genai/#json-response-schema
class GeminiAPIUnit:
    def __init__(self):
        self.api_key = JsonAccessor.loadGeminiAPIKey()
        self.client = genai.Client(api_key = self.api_key)

    def modelList(self):
        models = []
        for model in generativeai.list_models():
            models.append(model)
        return models
    
    
    def test(self):
        response = self.client.models.generate_content(model="gemini-2.0-flash", contents="私はメガデンリュウです。わかりますか？")   
        print(response.text)

    