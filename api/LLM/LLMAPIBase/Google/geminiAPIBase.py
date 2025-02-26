
import google.generativeai as genai
from api.DataStore.JsonAccessor import JsonAccessor

# https://googleapis.github.io/python-genai/#json-response-schema
class GeminiAPIUnit:
    def __init__(self):
        self.api_key = JsonAccessor.loadGeminiAPIKey()
        genai.configure(api_key=self.api_key)

    def modelList(self):
        models = []
        for model in genai.list_models():
            models.append(model)
        return models
    
    def request(self, model_name, prompt):
        response = genai.generate(model_name=model_name, prompt=prompt)
        return response