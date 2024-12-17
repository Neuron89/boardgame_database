import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC8cczL5e75USOqo9DjFk03KwufNuVy61U",
  authDomain: "boardgame-b972a.firebaseapp.com",
  databaseURL: "https://boardgame-b972a-default-rtdb.firebaseio.com",
  projectId: "boardgame-b972a",
  storageBucket: "boardgame-b972a.firebasestorage.app",
  messagingSenderId: "1047946639579",
  appId: "1:1047946639579:web:a8d8160e07e5a9f315b4fe"
};

// Initialize Firebase
let app;
let database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  
  // Verify database connection
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { database };

