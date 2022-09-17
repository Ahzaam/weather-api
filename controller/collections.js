const { response } = require("express");
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

const usersCollection = db.collection('users')
const weatherCollection = db.collection('weather')
const forcastCollection = db.collection('forcast')


Collections = {
  saveData : async (city, data) =>  {
    let ret = false;
    await weatherCollection.doc(city).set(data)
    .then(response => {
      ret = response
    })
    .catch(err => {
      console.log(err)
      return false
    })
    return ret
    
  },
  saveForecast : async (city, data) =>  {
    let ret = false;
    await forcastCollection.doc(city).set(data)
    .then(response => {
      ret = response
    })
    .catch(err => {
      console.log(err)
      return false
    })
    return ret
    
  },
  getToken: async () => new Promise((async (resolve, reject) => {
    const token = db.collection('token').doc('twitter')
    const tokens = await token.get()
    .then(data => {resolve(data.data())})
    .catch(err => {reject(err)})
  })


)}

module.exports = Collections