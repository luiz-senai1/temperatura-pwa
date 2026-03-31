// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvhzPqGXkT8VllkBwbI_7OyqDPOoGUEUw",
    authDomain: "sensor-temperatura31.firebaseapp.com",
    databaseURL: "https://sensor-temperatura31-default-rtdb.firebaseio.com",
    projectId: "sensor-temperatura31",
    storageBucket: "sensor-temperatura31.firebasestorage.app",
    messagingSenderId: "407363453311",
    appId: "1:407363453311:web:0acee16bc110b8a71c5a4a"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exporta apenas o banco de dados
export { database };
