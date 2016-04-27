var YQLClient = require('yql-client'),
    YQL = YQLClient.YQL;
var vocabulary = require('../helpers/vocabulary');

module.exports = {

    getWeatherResponse: function getWeatherResponse(user, callback) {
        var userText = '';
        if (user) {
            userText = "<@" + user + "> ";
        }
        // JSON format back from Yahoo {
        //    "code": "28",
        //    "date": "Thu, 21 Apr 2016 10:00 AM CDT",
        //    "temp": "62",
        //    "text": "Mostly Cloudy"
        //}
        YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Chicago, IL")', function(r) {
            if (r.query.results.channel.item.condition != null) {
                var currentWeather = r.query.results.channel.item.condition;
                var currentTemp = parseInt(currentWeather.temp);
                var weatherReaction = '';

                if (currentTemp < 40) {
                    weatherReaction = ' and you better have a coat because its ' + vocabulary.getMikeDang() + ' freezin';
                }
                else if (currentTemp < 50) {
                    weatherReaction = ' and you better have a coat because its ' + vocabulary.getMikeDang() + ' chilly';
                }
                else if (currentTemp > 70) {
                    weatherReaction += ' and you better have a some shorts on cuz its ' + vocabulary.getMikeDang() + ' hot out there';
                }

                callback(userText + 'the weather today is ' + vocabulary.getMikeDang() + ' ' + currentWeather.text.toLowerCase() + weatherReaction);

            } else {
                callback(userText + 'the weather is ' + vocabulary.getMikeDang() + ' stick yo head outside');
            }

        });

    }
};