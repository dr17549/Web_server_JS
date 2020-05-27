# Web_tech
Web Technologies 2019 source code

# How to Run (copied from report)

The website comes with a startup script that initialises the necessary information in a Mongo database. To run the website, you will need a Mongo database running on port 27017 with hostname “localhost”. You will also need to install Node.js and npm.

Then follow these steps:

1. Run npm install to install the required node modules
2. Navigate to the /graphite folder and run npm watch devStart
3. The website should now be accessible at localhost:3000

As part of the startup script, an admin user with email test@test.com and password testtest has already been created. These credentials will allow you to see the admin features. As well as this, admin will have access to an example story (dataset) called The Odyssey (which is really only half the Odyssey taken from the internet so for some reason the character names are all the Latin variants).

If you wish to run the tests, you will have to navigate to the /selenium folder. Then:

1. Run npm install
2. Run npm test

You will need to have the correct Chrome driver installed and placed in /selenium, corresponding to your operating system and the version of Chrome you have installed. It can be found here: Selenium Chrome Driver.
