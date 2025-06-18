import asyncio
import websockets

async def connect_to_websocket_server(uri):
    try:
        async with websockets.connect(uri) as websocket:
            print(f"Connecté au serveur WebSocket : {uri}")

            message_to_send = '{"message":"Bonjour gemini!"}'
            await websocket.send(message_to_send)
            print(f"Message envoyé au serveur : {message_to_send}")

            while True:
                try:
                    received_message = await websocket.recv()
                    print(f"Message reçu du serveur : {received_message}")
                except websockets.exceptions.ConnectionClosedOK:
                    print("Connexion fermée par le serveur.")
                    break
                except websockets.exceptions.ConnectionClosedError as e:
                    print(f"Connexion fermée de manière inattendue : {e}")
                    break
                except asyncio.CancelledError:
                    print("Tâche de réception annulée.")
                    break
                except Exception as e:
                    print(f"Erreur inattendue lors de la réception : {e}")
                    break

    except ConnectionRefusedError:
        print(f"Connexion refusée. Assurez-vous que le serveur est en cours d'exécution sur {uri}")
    except Exception as e:
        print(f"Une erreur est survenue : {e}")

if __name__ == "__main__":
    websocket_uri = "ws://192.168.88.19:9000/ws/chat/"
    
    asyncio.run(connect_to_websocket_server(websocket_uri))