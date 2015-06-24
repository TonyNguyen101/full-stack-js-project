var express 					= require('express'),
    app 							= express(),
    bodyParser 				= require('body-parser'),
    methodOverride 		= require("method-override"),
    session 					= require("cookie-session"),
    morgan 						= require("morgan"),
    db 								= require("./models"),
    request						= require("request");
/*    loginMiddleware 	= require("./middleware/loginHelper"),
    routeMiddleware 	= require("./middleware/routeHelper");
    require('dotenv').load();*/

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

//ROOT - All recipes, no login
app.get('/', function (req, res){
	res.redirect('/recipes');
});

//SEARCH INDEX
app.get('/search', function (req, res){
	res.render('search/index'); 
});	

//SEARCH BIGOVEN w/AJAX from Index page
app.post('/search', function (req, res){
	var searchTerm = req.body.term.searchTerm;
	var url = "http://api.bigoven.com/recipes?pg=1&rpp=25&title_kw=";
	var apiKey = "&api_key=dvxK85et7PRw0l0hH7I3D9R2cFMvdPop";
	request({
		type: 'GET',
		json: true,
		uri: url + searchTerm + apiKey
	}, 
	function (err, response, body){
		if (err) {
	    console.log("Error! Request failed - " + err);
	  } else if (!err && response.statusCode === 200) {
	  	res.send(body);
		}
	});		
});

//SHOW RECIPE NOT IN DB
app.get('/search/:id/show', function (req, res){
	var recipeId = req.params.id;
	var url = "http://api.bigoven.com/recipe/";
	var apiKey = "dvxK85et7PRw0l0hH7I3D9R2cFMvdPop";
	request({
		type: 'GET',
		json: true,
		uri: url + recipeId + "?api_key=" + apiKey
	}, 
	function (err, response, body){
		if (err) {
	    console.log("Error! Request failed - " + err);
	  } else if (!err && response.statusCode === 200) { 
	  	res.render('recipes/show', {bigOvenRecipe: body});
		}
	});		
	
});

//NEW

//CREATE
/*app.post('/recipes', function (req, res){
	db.Recipe.create(req.body.recipe, function (err, ))
});*/
//SHOW RECIPE IN DB

 
//EDIT

//UPDATE

//DESTROY

//ERROR
app.get('*', function(req,res){
  res.render('errors/404');
});

app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});