const TwitterApi = require("twitter-api-v2").default;

const { getToken } = require("./collections");


const tweet = async (msg) => new Promise(async (resolve, reject) => {
    let data = await getToken();
    const twitterClient = new TwitterApi({
        appKey: data.apikey,
    appSecret: data.apisecretkey,
    accessToken: data.accestoken,
    accessSecret: data.accestokensecret,
      
    });
  
      try{
        resolve(twitterClient.readWrite.v1.tweet(msg))
      } catch(e){
        reject(false)
      }
})

module.exports = tweet;
