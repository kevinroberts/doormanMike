# Mike Doorman 

The famous doorman from 211 Wacker comes to Slack now with all your favorite catch phrases!

## RUN THE BOT: ##

`node ./bin/www`

## SOME PRE-REQS

Setup a .env file in the root of the project with the following properties

Grab an API key from https://cleverbot.io/keys for use with cleverbot responses

`NODE_ENV=development`

`token=<BOT TOKEN FROM SLACK>`

`TIMEZONE=America/Chicago`

`CLEVERBOTUSER=<API USER>`

`CLEVERBOTAPI=<API KEY>`

## Some features: ##

Say: `"Hello"`
The bot will reply "Hello!"

Say: `"who are you?"`
The bot will tell you its name, where it running, and for how long.

Say: `"Call me <nickname>"`
Tell the bot your nickname. Now you are friends.

Say: `"who am I?"`
The bot will tell you your nickname, if it knows one for you.

 Make sure to invite your bot into other channels using /invite @doorman-Mike!

## EXTEND THE BOT: ##
Botkit has many features for building cool and useful bots!
Read all about it here:

-> http://howdy.ai/botkit
