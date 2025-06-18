## Installation

1. Cloner le repository
2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Voici comment obtenir et utiliser un token :

### 1. Obtenir un Token

#### Endpoint : POST /api/token/

```json
{
    "username": "votre_username",
    "password": "votre_password"
}
```

#### Réponse
```json
{
    "access": "votre_token_jwt",
    "refresh": "votre_refresh_token"
}
```

### 2. Rafraîchir un Token

#### Endpoint : POST /api/token/refresh/

```json
{
    "refresh": "votre_refresh_token"
}
```

#### Réponse
```json
{
    "access": "nouveau_token_jwt"
}
```

### 3. Utilisation du Token

Pour chaque requête API, incluez le token dans le header :
```
Authorization: Bearer votre_token_jwt
```

### 4. Durée de Validité

- Token d'accès : 5 minutes
- Token de rafraîchissement : 24 heures

### 5. Exemple d'Authentification

```python
import requests

# Obtenir un token
auth_url = "http://localhost:8800/api/token/"
auth_data = {
    "username": "votre_username",
    "password": "votre_password"
}
auth_response = requests.post(auth_url, json=auth_data)
tokens = auth_response.json()

# Utiliser le token pour une requête API
api_url = "http://localhost:8800/api/symptoms/"
headers = {
    "Authorization": f"Bearer {tokens['access']}",
    "Content-Type": "application/json"
}
```

### 6. Gestion des Erreurs d'Authentification

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Token invalide ou expiré | Utiliser le refresh token pour obtenir un nouveau token |
| 403 | Token manquant | Ajouter le token dans le header Authorization |
| 400 | Données d'authentification invalides | Vérifier les identifiants |

## Endpoints API

### POST /api/symptoms/

Endpoint pour obtenir une prédiction de maladie basée sur les symptômes de l'utilisateur.


#### Authentification
- Nécessite une authentification (JWT Token)
- Ajouter le token dans le header : `Authorization: Bearer <votre_token>`

#### Format de la Requête

```json
{
    "symptoms": {
        "fever": True,
        "cough": False,
        "fatigue": True,
        "difficulty_breathing": false,
		"blood_pressure":"low | normal |high"
    }
}
```

#### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| fever | boolean | Présence de fièvre |
| cough | boolean | Présence de toux |
| fatigue | boolean | Présence de fatigue |
| difficulty_breathing | boolean | Présence de difficultés respiratoires |

#### Réponse

```json
{
    "prediction": "Nom de la maladie",
    "confidence": 0.95
}
```

#### Codes de Réponse

- 200 OK : Prédiction réussie
- 400 Bad Request : Erreur dans les données fournies
- 401 Unauthorized : Non authentifié
- 500 Internal Server Error : Erreur serveur

## Modèle de Données Utilisateur

L'API utilise les informations suivantes de l'utilisateur :

| Champ | Type | Description |
|-------|------|-------------|
| age | integer | Âge de l'utilisateur |
| gender | string | Genre ('Male' ou 'Female') |
| blood_pressure | string | Niveau de pression artérielle ('low', 'Normal', 'High') |
| cholesterol_level | string | Niveau de cholestérol ('low', 'Normal', 'High') |

## Modèle ML

Le système utilise un modèle Random Forest Classifier entraîné sur un ensemble de données médicales. Le modèle prend en compte :

- Âge
- Genre
- Symptômes (Fièvre, Toux, Fatigue, Difficultés respiratoires)
- Pression artérielle
- Niveau de cholestérol

## Gestion des Erreurs

L'API gère les cas suivants :
- Données manquantes
- Format de données invalide
- Erreurs de prédiction
- Problèmes d'authentification

## Exemple d'Utilisation

```python
import requests

url = "localhost:8800/api/symptoms/"
headers = {
    "Authorization": "Bearer votre_token_jwt",
    "Content-Type": "application/json"
}
data = {
    "symptoms": {
        "fever": True,
        "cough": False,
        "fatigue": True,
        "difficulty_breathing": False
    }
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

## API de Contact Professionnel

### GET /api/doctors/
Liste tous les médecins disponibles.

#### Authentification
- Nécessite une authentification (JWT Token)

#### Réponse
```json
[
    {
        "id": 1,
        "name": "Dr. Smith",
        "email": "smith@example.com",
        "speciality": "Cardiologie"
    }
]
```

### POST /api/slots/
Créer un créneau de disponibilité.

#### Authentification
- Nécessite une authentification (JWT Token)
- Permission : Médecin uniquement

#### Format de la Requête
```json
{
    "start": "2024-03-20T10:00:00Z",
    "end": "2024-03-20T11:00:00Z"
}
```

#### Réponse
```json
{
    "message": "Slot crée avec succès"
}
```

### GET /api/slots/available/
Obtenir tous les créneaux disponibles.

#### Authentification
- Nécessite une authentification (JWT Token)
- Permission : Patient uniquement

#### Réponse
```json
[
    {
        "id": 1,
        "start_time": "2024-03-20T10:00:00Z",
        "end_time": "2024-03-20T11:00:00Z",
        "doctor": {
            "id": 1,
            "name": "Dr. Smith"
        }
    }
]
```

### POST /api/slots/reserve/
Réserver un créneau.

#### Authentification
- Nécessite une authentification (JWT Token)
- Permission : Patient uniquement

#### Format de la Requête
```json
{
    "slot_id": 1,
    "doctor_id": 1
}
```

#### Réponse
```json
{
    "message": "Slot réservé avec succès"
}
```

### GET /api/appointments/doctor/
Obtenir les rendez-vous d'un médecin.

#### Authentification
- Nécessite une authentification (JWT Token)
- Permission : Médecin uniquement

#### Réponse
```json
[
    {
        "id": 1,
        "patient": {
            "id": 1,
            "name": "John Doe"
        },
        "slot": {
            "start_time": "2024-03-20T10:00:00Z",
            "end_time": "2024-03-20T11:00:00Z"
        }
    }
]
```

### GET /api/appointments/patient/
Obtenir les rendez-vous d'un patient.

#### Authentification
- Nécessite une authentification (JWT Token)
- Permission : Patient uniquement

#### Réponse
```json
[
    {
        "id": 1,
        "doctor": {
            "id": 1,
            "name": "Dr. Smith"
        },
        "slot": {
            "start_time": "2024-03-20T10:00:00Z",
            "end_time": "2024-03-20T11:00:00Z"
        }
    }
]
```

## API de Traitement

### GET /api/treatments/
Liste tous les traitements.

#### Authentification
- Nécessite une authentification (JWT Token)

#### Réponse
```json
[
    {
        "id": 1,
        "medocs_name": "Paracétamol",
        "frequency": 3,
        "started_at": "2024-03-20T10:00:00Z",
        "duration_days": 7,
        "end": "2024-03-27T10:00:00Z",
        "jours_restants": 5
    }
]
```

### GET /api/treatments/{id}/
Obtenir les détails d'un traitement spécifique.

#### Authentification
- Nécessite une authentification (JWT Token)

#### Réponse
```json
{
    "id": 1,
    "medocs_name": "Paracétamol",
    "frequency": 3,
    "started_at": "2024-03-20T10:00:00Z",
    "duration_days": 7,
    "end": "2024-03-27T10:00:00Z",
    "jours_restants": 5
}
```

### POST /api/treatments/
Créer un nouveau traitement.

#### Authentification
- Nécessite une authentification (JWT Token)

#### Format de la Requête
```json
{
    "medocs_name": "Paracétamol",
    "frequency": 3,
    "duration_days": 7
}
```

#### Réponse
```json
{
    "id": 1,
    "medocs_name": "Paracétamol",
    "frequency": 3,
    "started_at": "2024-03-20T10:00:00Z",
    "duration_days": 7,
    "end": "2024-03-27T10:00:00Z",
    "jours_restants": 7
}
```

### PUT /api/treatments/{id}/
Mettre à jour un traitement existant.

#### Authentification
- Nécessite une authentification (JWT Token)

#### Format de la Requête
```json
{
    "medocs_name": "Ibuprofène",
    "frequency": 2,
    "duration_days": 5
}
```

### DELETE /api/treatments/{id}/
Supprimer un traitement.

#### Authentification
- Nécessite une authentification (JWT Token)

#### Réponse
- 204 No Content en cas de succès

### Codes de Réponse Communs

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Création réussie |
| 204 | Suppression réussie |
| 400 | Données invalides |
| 401 | Non authentifié |
| 403 | Permission refusée |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

## API WebSocket Chatbot

### Connexion WebSocket
```
ws://localhost:8800/ws/chatbot/
```

### Format des Messages

#### Connexion
Lors de la connexion, le serveur envoie :
```json
{
    "type": "connection_established",
    "message": "Connexion établie avec le chatbot"
}
```

#### Envoi de Message
Format pour envoyer un message au chatbot :
```json
{
    "message": "Votre message ici"
}
```

#### Réception de Message
Format de la réponse du chatbot :
```json
{
    "type": "chat_message",
    "message": "Réponse du chatbot"
}
```

#### Message d'Erreur
En cas d'erreur :
```json
{
    "type": "error",
    "message": "Description de l'erreur"
}
```

### Exemple d'Utilisation avec Python

```python
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
```

### Notes Importantes
-Pour lancer le serveur websocket :
``` daphne -b 0.0.0.0 -p 9000 Backend.asgi:application```
dans le dossier contenant le backend.

- La connexion WebSocket nécessite une clé API Google valide (GOOGLE_API_KEY)
- Les messages sont traités de manière asynchrone
- La connexion est maintenue jusqu'à ce que le client se déconnecte
- Les erreurs sont gérées et renvoyées au client

