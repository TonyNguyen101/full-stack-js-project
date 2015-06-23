var express 					= require('express'),
    app 							= express(),
    bodyParser 				= require('body-parser'),
    methodOverride 		= require("method-override"),
    session 					= require("cookie-session"),
    morgan 						= require("morgan"),
    /*db 								= require("./models"),*/
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

//INDEX
app.get('/recipes', function (req, res){
	var url = "http://api.bigoven.com/recipes?pg=1&rpp=25&title_kw=";
	var searchTerm = "salmon";
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
	  	var bigOvenDataArray = body;
	  	res.render('recipes/index', {bigOvenDataArray:bigOvenDataArray});
	  	/*res.send(bigOvenDataArray);*/
	  }
	});  
});	




//NEW

//CREATE

//SHOW

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