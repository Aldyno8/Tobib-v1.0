import React, { useState, FormEvent, ChangeEvent } from "react";
import { FaAppleAlt, FaCheckCircle, FaDumbbell, FaHeartbeat, FaLightbulb, FaTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Symptom } from "@/services/Symptoms.api";
import tobib from "@/assets/images/tobib.png"
import { ChartCandlestick } from "lucide-react";


interface SymptomInputProps {
  onSubmitSymptoms: (symptoms: string) => void;
}

const keywords = [
  "fièvre", "toux", "maux de tête", "fatigue", "saignement", "mal à la jambe", "nausée", "vomissements",
  "douleurs abdominales", "perte d'appétit", "essoufflement", "démangeaisons",
  "maux de gorge", "frissons", "éruption cutanée", "raideur musculaire", "maux de dos"
];

const Symptoms: React.FC<SymptomInputProps> = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isMask, setIsMask] = useState<boolean>(false);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleAddSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSearch("");
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(item => item !== symptom));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (window.innerWidth <= 768) {
      setIsMask(true);
    }
    event.preventDefault();

    if (selectedSymptoms.length > 0) {
      try {
        let response = await Symptom(selectedSymptoms, localStorage.getItem("token"));
        console.log(response);
        setResult(response);
      } catch (error) {
        console.error("Erreur lors de l'envoi des symptômes", error);
      }
    } else {
      alert("Veuillez sélectionner au moins un symptôme.");
    }
  };

  const filteredKeywords = keywords.filter(keyword =>
    keyword.toLowerCase().includes(search.toLowerCase()) && !selectedSymptoms.includes(keyword)
  );

  function handleClick() {
    setIsMask(false);
    console.log(isMask);
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <Button onClick={handleClick} className={`${!isMask ? "hidden" : "block"} bg-green-500 text-white hover:bg-green-600 transition-all`}>
        Analyser des symptômes
      </Button>
      
      <div className={`${isMask ? "hidden" : "block"} w-full md:w-1/2`}>
        <div className="p-6 bg-muted rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <ChartCandlestick
              className="w-10 h-10"
            />
            Diagnostic interactif
          </h2>
          <p className="text-foreground mb-4">
            Sélectionnez vos symptômes dans la liste ci-dessous pour obtenir des suggestions et des informations utiles.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Tapez un symptôme..."
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filteredKeywords.map((keyword) => (
                  <button
                    type="button"
                    key={keyword}
                    onClick={() => handleAddSymptom(keyword)}
                    className="px-4 py-2 bg-primary-foreground text-foreground rounded-md hover:bg-muted transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSymptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="bg-primary text-white py-2 px-4 rounded-full flex items-center"
                  >
                    {symptom}
                    <button
                      type="button"
                      onClick={() => handleRemoveSymptom(symptom)}
                      className="ml-2 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                    >
                      <FaTimesCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary transition-colors"
            >
              Envoyer à TobIb
            </button>
          </form>
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <div className="p-6 bg-muted rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">Résultats </h2>
          {result ? (
            <div className="bg-blue-50 p-6 rounded-lg shadow-lg flex flex-col gap-6 items-center">
              <FaCheckCircle size={32} className="text-blue-600" />
              <h2 className="text-lg font-extrabold text-blue-800">Analyse Personnalisée</h2>
            
              <div className="w-full">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <FaLightbulb size={20} className="text-blue-500" /> Conseils de vie :
                </h3>
                <ul className="list-disc list-inside text-gray-800">
                  {result.life_advice.map((res, index) => (
                    <li key={`life-advice-${index}`}>{res}</li>
                  ))}
                </ul>
              </div>
            
              <div className="w-full">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <FaHeartbeat size={20} className="text-red-500" /> Possibilités de maladies :
                </h3>
                <ul className="list-disc list-inside text-gray-800">
                  {result.possibles_diseases.map((res, index) => (
                    <li key={`disease-${index}`}>{res}</li>
                  ))}
                </ul>
              </div>
            
              <div className="w-full">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <FaAppleAlt size={20} className="text-green-500" /> Nourritures recommandées :
                </h3>
                <ul className="list-disc list-inside text-gray-800">
                  {result.recommanded_food.map((res, index) => (
                    <li key={`food-${index}`}>{res}</li>
                  ))}
                </ul>
              </div>
            
              <div className="w-full">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <FaDumbbell size={20} className="text-orange-500" /> Exercices recommandés :
                </h3>
                <ul className="list-disc list-inside text-gray-800">
                  {result.recommanded_physical_exercice.map((res, index) => (
                    <li key={`exercise-${index}`}>{res}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <img
                src={tobib}
                alt="Aucun résultat"
                className="mb-4 w-96"
              />
              <p>Aucun symptôme soumis pour l'instant.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Symptoms;
