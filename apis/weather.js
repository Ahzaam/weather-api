const https = require("https");
const { resolve } = require("path");
let today = new Date();
Weather = {
  getWeather: (city) =>
    new Promise((resolve, reject) => {
      https
        .get(`${process.env.WEATHER_API_URL_WITH_KEY}&q=${city}`, (resp) => {
          let data = "";
          // A chunk of data has been received.
          resp.on("data", (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on("end", () => {
            resolve(data);
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    }),

  getAirData: (lon, lat) =>
    new Promise((resolve, reject) => {
      https
        .get(
          `${process.env.AIR_DATA_URL_WITH_KEY}&lon=${lon}&lat=${lat}`,
          (resp) => {
            let data = "";
            // A chunk of data has been received.
            resp.on("data", (chunk) => {
              data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
              resolve(data);
            });
          }
        )
        .on("error", (err) => {
          console.error(err)
          reject(err + 'get air data');
        });
    }),

  getForcastByCordinates: (lon, lat) =>
    new Promise((resolve, reject) => {
      https
        .get(
          `${process.env.WEATHER_FORCAST_API_URL_WITH_KEY}&lon=${lon}&lat=${lat}`,
          (resp) => {
            let data = "";
            // A chunk of data has been received.
            resp.on("data", (chunk) => {
              data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on("end", () => {
              resolve(data);
            });
          }
        )
        .on("error", (err) => {
          console.error(err)
          reject(err + 'get air data');
        });
    }),

  getAllDataByCity: (city) =>
    new Promise(async (resolve, reject) => {
      // data container
      let all_data = {};
      // getting weather by city
      await Weather.getWeather(city)
        .then(async (result) => {
          all_data.Weather = JSON.parse(result);
          // getting air data by lon, lat
          all_data.Weather.error = 'check this'

          await Weather.getAirData(
            
            all_data.Weather.coord.longitude,
            all_data.Weather.coord.latitude
          )
            .then((result) => {
                
              all_data.Air = JSON.parse(result);

              resolve(all_data);
              // Return
            })
            .catch((err) => {
              all_data.Air = { message: "Air data Not Found" };
              // returning without air data
              console.error(err)
              reject(`{"message": ${err}}, "task":"get air data"`);
            });
        })
        .catch((err) => {
          console.error(err)
          reject(`{"message": ${err}}, "task":"get weather data"`);
        });
    }),

  getAllDataByIp: (ip) =>
    new Promise(async (resolve, reject) => {
      ip = ip === undefined ? "8.8.8.8" : ip;
     
        
      await Weather.getIpLocation(ip)
        .then(async (ipresponse) => {
          let ipjsondata = JSON.parse(ipresponse);
          await Weather.getAllDataByCity(ipjsondata.city)
            
            .then((responce) => {
                responce.Ip = ipjsondata
                resolve(responce)})
            .catch((err) =>{
              console.error(err)
                reject(`{"message": ${err}}, "task":"get Ip location"`)
            }
              
            );
        })
        .catch((err) => {
          console.error(err)
          resolve(`{"message": ${err}}, "task":"get all data by ip"`);
        });
    }),

    getIpLocation : (ip) => new Promise((resolve, reject) => {
        
            https.get(`${process.env.IPLOCATION_URL}&ip=${ ip }`, (resp) => {
                let data = ''
                // A chunk of data has been received.
                resp.on('data', (chunk) => {
                  data += chunk;
                  
                });
              
           
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                   resolve(data)
                });
              
              }).on("error", (err) => {
                reject(err + 'get ip location')
              })
        
        }),

        getForCastByCity: (city) => new Promise(async (resolve, reject) => {
          let data = {}
          await Weather.getWeather(city)
          .then(async (responce) => {
            jsonres = JSON.parse(responce)

            data.current = jsonres
            await Weather.getForcastByCordinates(jsonres.coord.lon, jsonres.coord.lat)
            .then((responce) => {
              data.forcast = JSON.parse(responce)
              resolve(data)
            })


          })
          .catch((err) => reject(err))

        }) 
};

module.exports = Weather;
