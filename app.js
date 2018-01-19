var express = require("express");
var app = express();
var request = require("request");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");

var options = {
  useMongoClient: true,
  autoIndex: false, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};

mongoose.connect('mongodb://localhost/movie',options);

//schema setup
var movieSchema = new mongoose.Schema({
  name: String,
  image: String,
  comments: String
});

var Movie  = mongoose.model("Movie", movieSchema);

/*Movie.create({
  name:"the  knight",
  image:"https://www.google.co.in/search?q=the+dark+knight+images&tbm=isch&source=iu&ictx=1&fir=AfutqRRo3mxnVM%253A%252CZr50DtLHz9AOpM%252C_&usg=__2DjowLSE4l_gkEpclLseeUE0ZxU%3D&sa=X&ved=0ahUKEwjlooXtnuHYAhUFCawKHfCeC2IQ9QEIKjAA#"
  ,comments: "it's the awesome best movie"
},function(err,movie){
  if(err){
    console.log(err);
  }else{
    console.log(movie);
  }
});
//var db= mongoose.connection;
*/

//for ejs file to read by browser
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");

//home page
app.get("/",function(req,res){
 
  res.render("search");
});


//result page after search
app.get("/result",function(req,res){
  var name  = req.query.name;
  var url = "http://www.omdbapi.com/?s="+name+"&apikey=383133d5";
  request(url,function(error,response,body){
    if(!error && response.statusCode==200){
      var data = JSON.parse(body);
      res.render("ans",{data : data});
    }
  });
});


app.get("/added",function(req,res){
  Movie.find({},function(err,allmovie){
    if (err) {
      console.log(err);
    } else {
      res.render("added",{movies:allmovie});
    }
  });
});


//for posting new movie
app.post("/added",function(req,res){
  //get data from add form
  console.log(req);
  var name = req.body.name;
  var image = req.body.image;
  var comments = req.body.comments;
  var newMovie = {name:name, image:image, comments:comments};
  //create a new movie and send it to db
  console.log(name);
  console.log(image);
  console.log(comments);
  Movie.create(newMovie,function(err,added_movie){
    if(err){
      console.log(err); 
    }else{
      //redirect back to added page
      console.log("hi");
      console.log(added_movie.name);
      console.log(added_movie.image);
      console.log(added_movie.comments);
      
      res.redirect("/added");
    }
  });
  
});

//page showing added movies by db



//adding new movies

app.get("/result/add",function(req,res){
  res.render("add");
});
/*request('url',function(error,response,body){
if(!error && response.statusCode==200){
console.log(body);
http://img.omdbapi.com/?apikey=[yourkey]&
}
});
*/
app.listen(3000,function(){
  console.log("server started");
});