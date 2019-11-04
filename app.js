let express = require('express');
let path    = require('path');
let bodyParser = require('body-parser');
let session = require('express-session')
let cors = require('cors')






let router  = require('./router');

let app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/public/', express.static(path.join(__dirname, './public/')))
// view engine setup
app.engine('html', require('express-art-template'));
// app.set('./view', {
//     debug: process.env.NODE_ENV !== 'production'
// });
app.set('views', path.join(__dirname, './view/'));
// app.set('view engine', 'art');

app.use(cors())
app.use(session({
    secret: 'cnode',
    resave: false,
    saveUninitialized: false
}))

app.use(router);


app.listen(3001, ()=> {
    console.log('Server is running : http://localhost:3001 !');
});




// app.all('/secret', function (req, res, next) {
//     console.log('Accessing the secret section ...')
//     next() // pass control to the next handler
// })
// routes
// app.get('/', function (req, res) {
//     res.render('index.art', {
//         user: {
//             name: 'aui',
//             tags: ['art', 'template', 'nodejs']
//         }
//     });
// });
