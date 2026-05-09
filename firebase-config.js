// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvYl-W9p_qxqxF2e3vLvL8vP5vVqQrRxo",
  authDomain: "nexus-pro-app-demo.firebaseapp.com",
  projectId: "nexus-pro-app-demo",
  storageBucket: "nexus-pro-app-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Firebase Initialization
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ============ FIREBASE DATABASE FUNCTIONS ============

// GET ҳама коррбарон
async function getUsers() {
  return new Promise((resolve) => {
    db.ref('users').on('value', (snapshot) => {
      const data = snapshot.val();
      resolve(data ? Object.values(data) : []);
    });
  });
}

// ADD корбари нав
async function addUser(user) {
  const newRef = db.ref('users').push();
  user.id = newRef.key;
  await newRef.set(user);
  return user;
}

// UPDATE корбар
async function updateUserData(id, updates) {
  await db.ref('users/' + id).update(updates);
}

// DELETE корбар
async function deleteUserData(id) {
  await db.ref('users/' + id).remove();
}

// LISTEN барои тағйирот (REAL-TIME SYNC) ⚡
function onUsersChange(callback) {
  db.ref('users').on('value', (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.values(data) : []);
  });
}

// GET THEME аз Firebase
async function getTheme() {
  return new Promise((resolve) => {
    db.ref('theme').once('value', (snapshot) => {
      resolve(snapshot.val() || 'light');
    });
  });
}

// SET THEME дар Firebase
async function setThemeData(themeId) {
  await db.ref('theme').set(themeId);
}
