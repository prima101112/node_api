// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router


// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/article'); 
// connect to our database

var BlogPost = require('./app/models/blogpost');

// more routes for our API will happen here

router.route('/posts')

	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {
		
		var postdata = new BlogPost(); 		// create a new instance of the Bear model
		postdata.title = req.body.title;  // set the bears name (comes from the request)
		postdata.isi = req.body.isi;
		postdata.author = req.body.author;

		// save the bear and check for errors
		postdata.save(function(err) {
			if (err)res.send(err);
			res.json({ message: 'Post created!' });
		});
		
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		BlogPost.find(function(err, postdata) {
			if (err)
				res.send(err);

			res.json(postdata);
		});
	});

router.route('/posts/:post_id')

	// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
	.get(function(req, res) {
		BlogPost.findById(req.params.post_id, function(err, post) {
			if (err)
				res.send(err);
			res.json(post);
		});
	})

	.put(function(req, res) {

		// use our bear model to find the bear we want
		BlogPost.findById(req.params.post_id, function(err, postdata) {

			if (err)
				res.send(err);
			if(req.body.title){
			postdata.title = req.body.title;}  // set the bears name (comes from the request)
			if(req.body.isi){
			postdata.isi = req.body.isi;}
			if(req.body.author){
			postdata.author = req.body.author;}

			// save the bear
			postdata.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Post updated!' });
			});

		});
	})

	.delete(function(req, res) {
		BlogPost.remove({
			_id: req.params.post_id
		}, function(err, postdata) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});




// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);