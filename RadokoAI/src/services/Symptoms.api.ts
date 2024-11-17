import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL as string;


export const Symptom = async (message : string[], token : string) => {
  try {
    const response = await axios.post(
      `${API_URL}/Assistant/Symptoms/`,
      { symptoms : message }, // Corps de la requête
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // Ajout du token
        },
      }
    );

    return response.data; // Retourne la réponse du chatbot
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Chat:", error);
    return "Erreur lors de la récupération de la réponse.";
  }
};
