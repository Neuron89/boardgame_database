const API_URL = '/api/boardgames';

export const fetchGames = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch games');
  return response.json();
};

export const addGame = async (gameData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData)
  });
  if (!response.ok) throw new Error('Failed to add game');
  return response.json();
};

export const searchGames = async (term) => {
  const response = await fetch(`${API_URL}/search?term=${encodeURIComponent(term)}`);
  if (!response.ok) throw new Error('Failed to search games');
  return response.json();
};
const API_URL = '/api/boardgames';

export const fetchGames = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch games');
  return response.json();
};

export const addGame = async (gameData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData)
  });
  if (!response.ok) throw new Error('Failed to add game');
  return response.json();
};

export const searchGames = async (term) => {
  const response = await fetch(`${API_URL}/search?term=${encodeURIComponent(term)}`);
  if (!response.ok) throw new Error('Failed to search games');
  return response.json();
};
const API_URL = '/api/boardgames';

export const fetchGames = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch games');
  return response.json();
};

export const addGame = async (gameData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData)
  });
  if (!response.ok) throw new Error('Failed to add game');
  return response.json();
};

export const searchGames = async (term) => {
  const response = await fetch(`${API_URL}/search?term=${encodeURIComponent(term)}`);
  if (!response.ok) throw new Error('Failed to search games');
  return response.json();
};
const API_URL = '/api/boardgames';

export const fetchGames = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch games');
  return response.json();
};

export const addGame = async (gameData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData)
  });
  if (!response.ok) throw new Error('Failed to add game');
  return response.json();
};

export const searchGames = async (term) => {
  const response = await fetch(`${API_URL}/search?term=${encodeURIComponent(term)}`);
  if (!response.ok) throw new Error('Failed to search games');
  return response.json();
};

