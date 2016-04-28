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
Doorman Mike will reply "Hello!"

Say: `"who are you?"`
Doorman Mike will tell you his name, where he's running, and for how long.

Say: `"Call me <nickname>"`
Tell Doorman Mike your nickname. Now you are friends.

Say: `"who am I?"`
Doorman Mike will tell you your nickname, if it knows one for you.

Say: `"what should I get for lunch?"`
Doorman Mike will give you a suggestion for a lunch destination

Say: `"send mornin to @username in #random"`
Mike will send a custom mornin' mornin' message to the specified slack user in that channel.

 Make sure to invite your bot into other channels using /invite @doorman-Mike!

## EXTEND THE BOT: ##
Botkit was used as the base framework for doorman-Mike's construction
Read all about it here:

-> http://howdy.ai/botkit

Some additional integrations include:
YQL - Yahoo! Query Language

Cleverbot.io
