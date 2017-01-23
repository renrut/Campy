let express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    session = require('express-session');



var app = express();

app.use(
    session({secret: 'campyrocks'})
);

const saltRounds = 10;

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('../public'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



let User = require('./models/userModel.js');
let Review = require('./models/reviewModel.js');
let Campsite = require('./models/campsiteModel.js');


let port = "32768"
let ext = "campy"
let ip = "192.168.99.100"
let db = mongoose.connection;

mongoose.connect('mongodb://'+ip+':'+port+"/"+ext);

let validUsername = function(username){
  return (username.length >= 6) && username.match(/^[a-zA-Z0-9]+$/);
}

let loggedIn = function(req){
  console.log("login: " + req.session.expires);
  return(req.session.expires > Date.now());
}



//index page
app.get('/', function(req, res) {
    if(loggedIn(req)){
      User.findOne({username:req.session.username},function(err, user){
        if(!err){
          if(user){
            res.render('index', {user:user});
          }
        }
      })
    }else{
      res.render('index', {user:null});
    }
});


//index page
app.get('/login', function(req, res) {
  res.status(200).render('register');
});

app.post('/login', function(req, res) {
  let data = req.body;
  User.findOne({username:data.username}, function(err, user){
    if(!err){
      if(user){
        let hashedPass = bcrypt.hashSync(data.password, user.salt);
        if(hashedPass != user.password){
          res.status(400).render('register', {error:"Incorrect Username or Password."});
        }else{
          var future = new Date();
          future.setDate(future.getDate() + 30);
          req.session.expires = future.getTime();
          req.session.username = user.username;
          res.status(200).redirect('/');
        }

      }else{
        res.status(400).render('register', {error:"Incorrect Username or Password."});
      }
    }
  })
});

app.get('/logout', function(req, res){
  var pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 1);
  req.session.expires = pastDate.getTime();
  req.session.username = "";
  res.redirect("/");
});

app.get('/register', function(req, res) {
  res.status(200).render('register');
});

app.post('/register', function(req, res) {
  let data = req.body;
  if(data.password != data.confirmpassword){
    res.status(400).render('register', {error:"Passwords must match."});
  }
  if(validUsername(data.username)){
    User.findOne({username:data.username}, function(err, user){
      if(!err){
        if(user){
          res.status(400).render('register', {error:"Username taken."});
        }else{
          let salt = bcrypt.genSaltSync(saltRounds);
          let hash = bcrypt.hashSync(data.password, salt);
          let newUser = new User({
              username: data.username,
              city: data.city,
              email: data.email,
              salt:salt,
              password:hash,
              reviews:[],
              votedReviews:[] //reviews on which the user has voted the helpfulness to prevent double votes
          });
          newUser.save();

          var future = new Date();
          future.setDate(future.getDate() + 30);
          req.session.expires = future.getTime();
          req.session.user = newUser.username;
          res.status(200).redirect('/');
        }
      }
    });
  }else{
      res.status(400).render('register', {error:"Username is too short. It must be 6 characters and alphanumeric only."});
  }

});

app.get('/site', function(req, res) {
    if(loggedIn(req)){
      res.status(200).render("addsite");

    }else{
      res.status(401).redirect("/login");
    }
});

app.post('/site', function(req, res){
  if(loggedIn(req)){
    let data = req.body;
    //sitename must be unique
    Campsite.findOne({name:data.name}, function(err, site){
      if(!err){
        if(!site){
          User.findOne({username:req.session.username}, function(err, user){
            if(!err){
              console.log(data.tags);
              let newSite = new Campsite({
                name: data.name,
                creator: user._id,
                rating: data.rating, //1-5
                dateCreated: Date(),
                directions: data.directions,
                description: data.description,
                price: data.price,    //1-5
                lng: data.lng, //geo coords
                lat: data.lat,
                size: data.size, //number of tents (idk)
                type: 1, //1,2,3 enumerated
                sitetags: data.tags,
                fire: data.fire,
                reviews:[]
              });
              console.log(newSite)
              newSite.save(function(err){
                if(!err){
                  user.prestige += 5;
                  user.save();
                  res.status(200).send(newSite._id);
                  console.log("saved");
                }else{
                  console.log(err);
                  res.status(401).send();
                }
              });
            }
          });
        }else{
          res.status(401).send();
        }
      }else{
        //idk
      }
    });

  }else{
    res.status(401).redirect("/login");
  }
});



app.get('/markers', function(req, res) {
  let data = req.query;

  let lats = data.lats;
  let lngs = data.lngs;


  //get mins and maxs
  let minLng = Math.min.apply(null, lngs);
  let maxLng =  Math.max.apply(null, lngs);
  let minLat =  Math.min.apply(null, lats);
  let maxLat =  Math.max.apply(null, lats);

  Campsite.find({ lat: { $gte: minLat, $lte: maxLat }, lng: { $gte: minLng, $lte: maxLng }}, function(err, markers){
      if(!err){
       res.status(200).send(markers);
      }else{
       res.status(400).send(markers);

      }
  });
});

let server = app.listen(8080, function () {
    console.log('Example app listening on ' + server.address().port);
});