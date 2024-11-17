import React, { useEffect, useState } from "react";

interface Recipe {
  name: string;
  recettes: {
    step_1: string;
    step_2: string;
    step_3: string;
    step_4: string;
  };
}

interface WeeklyRecipesData {
  [key: string]: Recipe;
}

const Advices: React.FC = () => {
  const [recipes, setRecipes] = useState<WeeklyRecipesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8000/Assistant/Recipes/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des recettes.");
        }
        const data: WeeklyRecipesData = await response.json();
        setRecipes(data); 
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 h-full rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
        </h2>
        <div className="flex justify-center items-center">
        <div className="loader flex justify-center items-center h-screen">
  <div className="w-64 h-64 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
</div>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 h-full rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Erreur</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-muted h-auto shadow-xl">
      <h2 className="text-2xl font-extrabold text-primary mb-8 text-center flex items-center justify-center gap-3">
        <i className="fas fa-utensils text-muted-foreground"></i> Recettes Hebdomadaires
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes &&
          Object.entries(recipes).map(([day, recipe], index) => (
            <div
              key={index}
              className="flex flex-col gap-4 p-4  border border-muted-foreground rounded-xl shadow-lg hover:scale-105 transform transition-transform duration-300"
            >
              {/* Jour de la semaine */}
              <div className="flex items-center gap-3 border-b pb-2">
                <i className="fas fa-calendar-day text-muted"></i>
                <h3 className="text-2xl font-semibold text-foreground  capitalize">
                  {day}
                </h3>
              </div>

              {/* Nom de la recette */}
              <div className="flex items-center gap-3">
                <i className="fas fa-drumstick-bite text-orange-500 text-xl"></i>
                <p className="text-md font-bold text-foreground">{recipe.name}</p>
              </div>

              {/* Étapes */}
              <div className="flex flex-col gap-4">
                {Object.entries(recipe.recettes).map(([_, description], i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-primary-foreground text-muted-foreground p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Badge numéroté */}
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-md ${
                        i % 2 === 0 ? "bg-blue-600" : "bg-green-600"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {/* Contenu de l'étape */}
                    <p className="text-muted-foreground  text-md leading-relaxed">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Advices;
