// Dependencies
var mongoose        = require('mongoose');
var Spot            = require('./model.js');


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all spots in the db
    app.get('/spots', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Spot.find({});
        query.exec(function(err, spots){
            if(err) {
                res.send(err);
            } else {
                // If no errors are found, it responds with a JSON of all spots
                res.json(spots);
            }
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new spots in the db
    app.post('/spots', function(req, res){

        // Creates a new Spot based on the Mongoose schema and the post bo.dy
        var newspot = new Spot(req.body);

        // New Spot is saved in the db.
        newspot.save(function(err){
            if(err)
                res.send(err);
            else
                // If no errors are found, it responds with a JSON of the new spot
                res.json(req.body);
        });
    });

    // Retrieves JSON records for all spots who meet a certain set of query conditions
    app.post('/query/', function(req, res){

        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var reqVerified     = req.body.reqVerified;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = Spot.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});

        }
       
        // ...include filter for HTML5 Verified Locations
        if(reqVerified){
            query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, spots){
            if(err)
                res.send(err);
            else
                // If no errors, respond with a JSON of all spots that meet the criteria
                res.json(spotss);
        });
    });

    // DELETE Routes (Dev Only)
    // --------------------------------------------------------
    // Delete a Spot off the Map based on objID
    app.delete('/spots/:objID', function(req, res){
        var objID = req.params.objID;
        var update = req.body;

        Spot.findByIdAndRemove(objID, update, function(err, spot){
            if(err)
                res.send(err);
            else
                res.json(req.body);
        });
    });
};
