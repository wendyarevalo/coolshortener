const express = require("express");
const app = express();
const path = require('path');
const Pool = require('pg').Pool
const dotenv = require('dotenv');

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
dotenv.config({ path:'project.env'});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWPRD,
    port: process.env.PGPORT,
})

function get_short_url() {
    return Math.random().toString(36).substring(2, 8)
}

app.get('/', function (req, res,){
    res.render('index');
});

app.post('/show_shortened', function (req, res){
    let long_url = req.body.long_url;
    let short_url = get_short_url();
    pool.query('INSERT INTO urls (long_url, short_url) VALUES ($1, $2);',[long_url, short_url],
        (error,results) => {
        if (error) {
            throw error
        }
    });
    res.render('newurl', {long_url: long_url, short_url: ('http://localhost:3000/' + short_url)});
});

app.get('/:short_suffix', function (req, res){
    if(req.params.short_suffix === "random"){
        pool.query('SELECT long_url FROM urls;',
            (error,results) => {
                if (error) {
                    throw error
                }
                let random_id = Math.floor(Math.random() * (results.rowCount-1))
                let long_url = "" + results.rows[random_id]["long_url"];
                res.redirect(long_url);
            });
    }else if(req.params.short_suffix !== "favicon.ico"){
        pool.query('SELECT long_url FROM urls WHERE short_url = $1;',[req.params.short_suffix],
            (error,results) => {
                if (error) {
                    throw error
                }
                let long_url = "" + results.rows[0]["long_url"];
                res.redirect(long_url);
            });
    }else{}
});

