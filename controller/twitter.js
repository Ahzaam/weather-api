const TwitterApi = require("twit");

const { getToken } = require("./collections");
const draw = require("./draw");

const tweet = async (result) =>
  new Promise(async (resolve, reject) => {
    let data = await getToken();
    const twitterClient = new TwitterApi({
      consumer_key: data.apikey,
      consumer_secret: data.apisecretkey,
      access_token: data.accestoken,
      access_token_secret: data.accestokensecret,
    });

    let temp = (result.Weather.main.temp - 273.15 ).toFixed(2)
    let tempnew = (result.Weather.main.temp - 273.15 ).toFixed(0)
    let city = result.Weather.name
    let cap =
      result.Weather.weather[0].description.charAt(0).toUpperCase() +
      result.Weather.weather[0].description.slice(1);

    let tweetmsg = `${cap} in ${city}, \nFeels like ${temp}°C with ${
      result.Weather.main.humidity
    }% Humidity and the wind speed of ${result.Weather.wind.speed} km/h \n\n#${
      result.Weather.name
    } #${
      result.Weather.sys.country
    } \nTweet from weatherapp : https://weather-forecast-92773.web.app`;

    let raw_b64 = await draw(result.Weather.timezone, result.Weather.weather[0].icon, tempnew, result.Weather.wind.speed, result.Weather.name)
     
    var b64content = raw_b64.replace(/^data:image\/\w+;base64,/, "");
    console.log(b64content)
    

    // await draw(result.Weather.timezone, result.Weather.weather[0].icon, tempnew, result.Weather.wind.speed, result.Weather.name)
      
    console.log(b64content)
    twitterClient.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string
        var altText = `${city} Weather`
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

        twitterClient.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: tweetmsg, media_ids: [mediaIdStr] }
            console.log(tweetmsg)
            twitterClient.post('statuses/update', params, function (err, data, response) {
              console.log(data)
              resolve(data)
            })
          }
        })
      })
  });

module.exports = tweet;
