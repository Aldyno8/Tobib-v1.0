export const login = async (name : string, email: string, password: string, endpoint : string ) => {
    console.log(`${BASE_URL}/auth/${endpoint}`)
  try {
    const response = await fetch(`${BASE_URL}/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, email, mot_de_passe : password }),
    });

    if (!response.ok) {
      throw new Error('Erreur de connexion');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
