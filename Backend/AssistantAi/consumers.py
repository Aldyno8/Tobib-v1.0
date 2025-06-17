import json
from channels.generic.websocket import AsyncWebsocketConsumer
import google.generativeai as AI
import os
import asyncio

class ChatBotConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        self.api_key = os.getenv("GOOGLE_API_KEY")
        AI.configure(api_key=self.api_key)

        self.generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        # Démarrage du modèle Gemini
        self.model = AI.GenerativeModel(
            model_name="gemini-2.5-flash-preview-04-17",
            generation_config=self.generation_config
        )
        self.chat = self.model.start_chat()

        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connexion établie avec le chatbot'
        }))

    async def disconnect(self, close_code):
        print(f"websocket déconnecté avec code {close_code}")

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            print(text_data)
            message = text_data_json.get('message', '')

            # Exécuter l'appel bloquant dans un thread séparé
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, self.chat.send_message, message)

            # Envoyer la réponse
            await self.send(text_data=json.dumps({
                'type': 'chat_message',
                'message': response.text
            }))

        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Erreur: {str(e)}'
            }))
