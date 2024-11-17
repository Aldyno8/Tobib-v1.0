import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'; 
import { Clock, Type, BarChart, Star } from 'lucide-react';

// Définir le type pour les données de l'exercice
interface Exercice {
  duration: string;
  exercices_type: string[];
  intensity: string;
  name: string;
}

const WeeklyExercises: React.FC = () => {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Récupérer les données depuis le backend
    fetch("http://localhost:8000/Assistant/Exercice/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setExercices(Object.values(data)); // Transformer l'objet JSON en tableau
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du fetch :", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8 text-primary">
        Liste des Exercices
      </h1>
      <div className="space-y-6">
        {exercices.map((exercice, index) => (
          <Card 
            key={index} 
            className="bg-muted shadow-md border border-border rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-secondary-foreground mb-4">{exercice.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Durée avec icône */}
              <p className="flex items-center text-muted-foreground">
                <Clock className="mr-6 text-foreground" /> 
                <strong>Durée: </strong> {exercice.duration}
              </p>
              
              {/* Type avec icône */}
              <p className="flex items-center text-muted-foreground">
                <Type className="mr-6 text-foreground" /> 
                <strong>Type: </strong> {exercice.exercices_type.join(", ")}
              </p>
              
              {/* Intensité avec icône */}
              <p className="flex items-center text-muted-foreground">
                <BarChart className="mr-6 text-foreground" /> 
                <strong>Intensité: </strong> {exercice.intensity}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end p-4">
              {/* Ajouter une icône Lucide agrandie */}
              <Star className="text-foreground text-6xl" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeeklyExercises;
