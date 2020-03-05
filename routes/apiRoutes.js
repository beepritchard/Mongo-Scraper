var mongoose = require("mongoose");
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {

    app.get("/", function(req, res) {
        res.render("enter", {
            title: "Enter NPR Scraped"
        });
    });
    //articles created in the database
    app.get("/scrape", function(req,res) {
        axios.get("https://www.npr.org/sections/news/").then(function (response) {
            var $ = cheerio.load(response.data);
            var notInDatabase = 0;
            $("article").each(function(i, element) {
                var headLine = $(element).find(".title").children("a").text();
                
                var link = $(element).find(".title").children("a").attr("href"); 

                var summary = $(element).find(".teaser").children("a").text();

                var article = {headLine, summary, link};
                console.log(article);
                //if this article hasn't already been scraped then add to database
                headLine && db.Article.find({})
                .then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].headLine !== headLine) {
                            notInDatabase++;
                        }
                    }
                    // console.log(notInDatabase);
                    // console.log(data.length);
                    if (notInDatabase === data.length) {
                        db.Article.create(article)
                        .then(function(dbArticle) {
                            // console.log(dbArticle);
                        })
                        .catch(function(err) {
                            // console.log(err);
                        });
                        notInDatabase = 0;
                    } else {
                        notInDatabase = 0;
                    }
                })
                .catch(function(err) {
                    return res.end(err);
                });
            });
            res.json({message: "Scrape Complete"});
        });
    });

    //get saved articles and display
    app.get("/articles/saved/", function(req, res) {
        db.Article.find({saved: true}).sort({created: -1}).limit(20).populate("note")
        .then(function(dbFound) {
            res.render("saved", {
                title: "Scraped Pi - Saved",
                dbFound: dbFound
            });
        })
        .catch(function(error) {
            if(error) {
                console.log(error);
            }
        });
    });

    //get articles and display
    app.get("/articles/:id?", function(req, res) {
        var id = req.params.id;
        if (id) {
            db.Article.findOne({_id: id})
            .populate("note")
            .then(function(dbFound) {
                res.json(dbFound);
            })
            .catch(function(error) {
                console.log(error);
            });
        } else {
            db.Article.find({}).sort({created: -1}).limit(20).populate("note")
            .then(function(dbFound) {
                res.render("home", {
                    title: "Scraped Pi",
                    dbFound: dbFound
                });
            })
            .catch(function(error) {
                if(error) {
                    console.log(error);
                }
            });
        }   
    });


    //add notes to articles 
    app.post("/articles/notes/:id", function(req, res) {
        var id = req.params.id;
        db.Note.create({title: req.body.title, body: req.body.body})
        .then(function(dbNote) {
            var noteId = dbNote._id;
            db.Article.findOneAndUpdate({_id: id}, {$push: {note: noteId}})
            .then(function(edited) {
                res.json({message: edited})
            })
            .catch(function(error) {
                res.end(error);
            });
        })
        .catch(function(err) {
            console.log(err);
            res.end(err);
        })
    });

    //add or remove an article from your saved articles 
    app.put("/article/:id", function(req, res) {
        var id = req.params.id;
        db.Article.findOneAndUpdate({_id: id}, {$set: {saved: req.body.saved}})
        .then(function(edited) {
            res.json(edited);
        })
        .catch(function(error) {
            res.end(error);
        });
    });

    //Delete a note from an article, note still available in database
    app.put("/article/notes/:id", function(req, res) {
        var id = req.params.id;
        db.Article.findOneAndUpdate({_id: id}, {$pull: {note: req.body.noteId}})
        .then(function(edited) {
            res.json(edited);
        })
        .catch(function(error) {
            res.end(error);
        });
    });
    
}
