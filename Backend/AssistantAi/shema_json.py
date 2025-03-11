import typing_extensions as typing 

class Recommendation(typing.TypedDict):
    possibles_diseases: list[str]
    recommanded_food: list[str]
    recommanded_physical_exercice: list[str]
    life_advice: list[str]
    
class Exercice(typing.TypedDict):
    name: str
    exercices_type: list[str]
    duration: str
    intensity:str
    
class ListExercice(typing.TypedDict):
    exercice_1: Exercice
    exercice_2: Exercice
    exercice_3: Exercice 
 
class Recettes(typing.TypedDict):
     step_1: str
     step_2: str
     step_3: str
     step_4: str
     
class Plats(typing.TypedDict):
     name: str
     ingredients: str
     recettes: Recettes 
     
class RecipeForWeek(typing.TypedDict):
    lundi: Plats
    mardi: Plats
    mercredi: Plats
    jeudi: Plats
    vendredi: Plats
    samedi: Plats
