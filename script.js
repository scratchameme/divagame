// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDejZmhxJ-wjwJ3-nE2I43vMmhRqgqhcxA",
    authDomain: "divagame-97e7c.firebaseapp.com",
    projectId: "divagame-97e7c",
    storageBucket: "divagame-97e7c.appspot.com",
    messagingSenderId: "253959990116",
    appId: "1:253959990116:web:506a1d0cdf752823656871"
};

// Initialise Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Code JavaScript principal

let currentPlayerDocId;

function generateRandomCode() {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < 3; i++) {
        code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return code;
}

// ... (le reste du code JavaScript)
// Utilisez les fonctions que vous avez déjà écrites ici, sans modification
// Assurez-vous que toutes les fonctions et écouteurs d'événements sont inclus ici
