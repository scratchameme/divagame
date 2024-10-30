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

let currentPlayerDocId;

// Fonction pour générer un code aléatoire
function generateRandomCode() {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < 3; i++) {
        code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return code;
}

// Fonction pour supprimer tous les joueurs de Firestore
async function clearPlayersCollection() {
    const playersSnapshot = await db.collection('Joueurs').get();
    const batch = db.batch();
    playersSnapshot.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('Tous les documents de la collection "Joueurs" ont été supprimés.');
}

// Fonction pour sauvegarder le code dans Firestore
async function saveCodeToFirestore(code) {
    try {
        await clearPlayersCollection();
        await db.collection('hostCodes').doc('codes').set({ code });
        console.log('Code sauvegardé dans Firestore :', code);
        displayPlayersList();
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du code:', error);
    }
}

// Fonction pour sauvegarder le pseudo dans Firestore
async function saveUsernameToFirestore(username) {
    try {
        const playersSnapshot = await db.collection('Joueurs').get();
        const playerCount = playersSnapshot.size + 1;
        const playerDocId = `Player${playerCount}`;
        
        await db.collection('Joueurs').doc(playerDocId).set({ username });
        console.log('Pseudo sauvegardé dans Firestore :', username);
        return playerDocId;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du pseudo:', error);
        return null;
    }
}

// Fonction pour sauvegarder un message dans Firestore
async function saveMessageToFirestore(message) {
    try {
        if (currentPlayerDocId && message) {
            await db.collection('Joueurs').doc(currentPlayerDocId).update({ message });
            console.log('Message sauvegardé dans Firestore :', message);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du message:', error);
    }
}

// Fonction pour afficher la liste des joueurs connectés
async function displayPlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    const playersSnapshot = await db.collection('Joueurs').get();
    playersSnapshot.forEach(doc => {
        const li = document.createElement('li');
        li.textContent = doc.data().username;
        playersList.appendChild(li);
    });
}

// Écouteur de changements pour la collection des joueurs
db.collection('Joueurs').onSnapshot(displayPlayersList);

// Événements pour les boutons Hébergeur et Joueur
document.getElementById('hostBtn').addEventListener('click', async () => {
    const code = generateRandomCode();
    document.getElementById('hostCode').textContent = code;
    document.getElementById('codeContainer').style.display = 'block';
    await saveCodeToFirestore(code);
    document.querySelector('.button-container').style.display = 'none';
    
    document.getElementById('chatContainer').style.display = 'block';
});

document.getElementById('playerBtn').addEventListener('click', () => {
    document.getElementById('playerContainer').style.display = 'block';
    document.querySelector('.button-container').style.display = 'none';
});

// Événement pour confirmer le code du joueur
document.getElementById('confirmBtn').addEventListener('click', async () => {
    const playerCode = document.getElementById('playerCode').value;
    const codeSnapshot = await db.collection('hostCodes').doc('codes').get();
    
    if (codeSnapshot.exists && codeSnapshot.data().code === playerCode) {
        document.getElementById('playerContainer').style.display = 'none';
        document.getElementById('usernameContainer').style.display = 'block';
        document.getElementById('errorMsg').textContent = '';
    } else {
        document.getElementById('errorMsg').textContent = 'Code incorrect, veuillez réessayer.';
    }
});

// Événement pour soumettre le pseudo
document.getElementById('submitUsernameBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    if (username) {
        currentPlayerDocId = await saveUsernameToFirestore(username);
        if (currentPlayerDocId) {
            const finalPlayersListContainer = document.getElementById('finalPlayersListContainer');
            const finalPlayersList = document.getElementById('finalPlayersList');
            finalPlayersList.innerHTML = '';
            const li = document.createElement('li');
            li.textContent = username;
            finalPlayersList.appendChild(li);
            finalPlayersListContainer.style.display = 'block';
            document.getElementById('usernameContainer').style.display = 'none';
        }
    }
});

// Événement pour envoyer un message
document.getElementById('sendMessageBtn').addEventListener('click', () => {
    const message = document.getElementById('playerMessage').value;
    if (message) {
        saveMessageToFirestore(message);
        document.getElementById('playerMessage').value = '';
    }
});

// Charger le contenu du header et du footer
function loadHTML(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error('Erreur lors du chargement du fichier:', error));
}

// Charger le header et le footer au démarrage
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('header.html', 'headerContainer');
    loadHTML('footer.html', 'footerContainer');
});
