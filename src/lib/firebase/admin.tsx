const admin = require('firebase-admin');

const serviceAccount = require('./path/to/your-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_UID;
const role = "admin"; 

admin.auth().setCustomUserClaims(uid, { role: role })
  .then(() => {
    console.log(`Роль ${role} успешно выдана пользователю ${uid}`);
  })
  .catch((error: any) => {
    console.log('Ошибка:', error);
  });