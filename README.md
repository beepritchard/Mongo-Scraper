# Mongo-Scraper:
Mongo scraper is the application which was created for purpose of scraping news from NPR news webpage. This application will allow user to scrape 20 recent articles from that day. User will have ability to enter note and saved the article for the future read. Also user can unmark saved article by clicking the "saved " button to change release the saved articles from the saved page.
![mongo-scraper](nprScraperHp.png)

## Technologies used:

* [Node.js](https://nodejs.org/en/docs/): Server-side javascript
* [Express.js](https://expressjs.com/): Backend server
* [Express-Handlebars](https://handlebarsjs.com/guide/#installation): Template language and input object to generate text format
* [Axios](https://www.npmjs.com/package/axios): Promise based HTTP client for the browser and node.js
* [Cheerio](https://github.com/cheeriojs/cheerio): Fast, flexible & lean implementation of core jQuery designed specifically for the server
* [MongoDB](https://docs.mongodb.com/guides/): NoSql Database
* [Mongoose](https://mongoosejs.com/docs/): ODM for MongoDB
* [Heroku](https://devcenter.heroku.com/articles/github-integration): Deployment using Heroku

## How to get start with the app:

### Basic run command
 - Goto the root of directory to install dependencies then

        `$ npm install`
                express
                express-handlebars
                Axios
                Cheerio
                MongoD - Mongo
                Mongoose
                

### How it works - Simple Overview

A get request is made by axios that receives the DOM (document-object model) of NPR web forum. Cheerio then captures each post's headline, link, and summary. That data is then stored in the MongoDB database (with some additional property names and values assigned to it) via mongoose ODM. 

A RESTful api is then constructed to handle request and response between the client and server. Adding a note, updating an article, and adding an article to your saved articles are examples of using the api architecture. Express-handlebars is used as the view-engine to render the client (browser for users).

