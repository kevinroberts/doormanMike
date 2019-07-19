const unirest = require('unirest');
const vocabulary = require('../helpers/vocabulary');


module.exports = {

  getWeatherResponse(controller, user, callback) {
    let userText = '';
    userText = `<@${user}> `;
    // JSON format back from API {
    // weather: [
    //   {
    //     id: 803,
    //     main: "Clouds",
    //     description: "broken clouds",
    //     icon: "04d"
    //   }
    unirest.get(`https://api.openweathermap.org/data/2.5/weather?id=4887398&units=imperial&APPID=${process.env.OPENWEATHERKEY}`)
      .header('Accept', 'application/json')
      .end((result) => {
        if (result && result.status === 200) {
          if (result.body.weather) {
            const weatherElement = result.body.weather[0];
            const currentWeather = weatherElement.description;
            const weatherMain = result.body.main;
            const currentTemp = parseInt(weatherMain.temp, 10);
            const temp = ` (currently ${weatherMain.temp}˚ F)`;
            let weatherReaction = '';

            if (currentTemp < 40) {
              weatherReaction = ` and you better have a thiq coat because its ${vocabulary.getMikeDang()} freezin`;
            } else if (currentTemp < 50) {
              weatherReaction = ` and you better have a coat because its ${vocabulary.getMikeDang()} chilly`;
            } else if (currentTemp > 70 && currentTemp < 80) {
              weatherReaction += ` and you better have a some shorts on cuz its ${vocabulary.getMikeDang()} hot out there`;
            } else if (currentTemp > 80) {
              weatherReaction += ` and you better just stay ${vocabulary.getMikeDang()} inside cuz its blazin outside`;
            }
            weatherReaction += temp;
            callback(`${userText}the weather today is ${vocabulary.getMikeDang()} ${currentWeather.toLowerCase()}${weatherReaction}`);
          }
        } else {
          console.error('could not parse weather details', result);
          callback(`${userText}the weather is ${vocabulary.getMikeDang()} stick yo head outside`);
        }
      });
  },
};
