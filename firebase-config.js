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

console.log('✅ Firebase initialized successfully');

// ============ FIREBASE DATABASE FUNCTIONS ============

// GET ҳама коррбарон
async function getUsers() {
  return new Promise((resolve, reject) => {
    db.ref('users').once('value', (snapshot) => {
      const data = snapshot.val();
      if(data) {
        const users = Object.keys(data).map(key => ({ ...data[key], id: key }));
        resolve(users);
      } else {
        resolve([]);
      }
    }, (error) => {
      console.error('Error getting users:', error);
      reject(error);
    });
  });
}

// ADD корбари нав
async function addUser(user) {
  try {
    const newRef = db.ref('users').push();
    const userData = { ...user, id: newRef.key };
    await newRef.set(userData);
    return userData;
  } catch(error) {
    console.error('Error adding user:', error);
    alert('Хатогӣ дар ифода: ' + error.message);
    throw error;
  }
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
    if(data) {
      const users = Object.keys(data).map(key => ({ ...data[key], id: key }));
      callback(users);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Error listening to users:', error);
  });
}

// GET THEME аз Firebase
async function getTheme() {
  return new Promise((resolve, reject) => {
    db.ref('theme').once('value', (snapshot) => {
      resolve(snapshot.val() || 'light');
    }, (error) => {
      console.error('Error getting theme:', error);
      reject(error);
    });
  });
}

// SET THEME дар Firebase
async function setThemeData(themeId) {
  try {
    await db.ref('theme').set(themeId);
  } catch(error) {
    console.error('Error setting theme:', error);
    throw error;
  }
}
