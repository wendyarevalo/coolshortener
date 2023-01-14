const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger');
const path = require('path');
const { Pool } = require('pg');
const views = require('koa-views');
const { koaBody } = require('koa-body');
const dotenv = require('dotenv');

const app = new Koa();
const router = new Router();

app.use(koaBody());
app.use(views(path.join(__dirname, 'views'), { extension: 'pug' }));
app.use(Logger());
dotenv.config({ path:'project.env'});
app.use(router.routes()).use(router.allowedMethods());

app.listen(3001, () => {
    console.log('Server running on port 3001');
});


app.pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWPRD,
    port: process.env.PGPORT,
})

function get_short_url() {
    return Math.random().toString(36).substring(2, 8)
}

router.get('/', async ctx => {
    await ctx.render(('index'));
});

router.post('/show_shortened', async (ctx) => {
    let long_url = ctx.request.body.long_url;
    let short_url = get_short_url();
    await ctx.app.pool.query('INSERT INTO urls (long_url, short_url) VALUES ($1, $2);',[long_url, short_url],
        (error,results) => {
            if (error) {
                throw error
            }
        });
    await ctx.render('newurl', {long_url: long_url, short_url: ('http://localhost:3001/' + short_url)});
});

router.get('/:short_suffix', async ctx =>{
    if(ctx.request.url === "/random"){
        const long_url = await ctx.app.pool.query('SELECT long_url FROM urls;')
            .then(function (data){
                let random_id = Math.floor(Math.random() * (data.rowCount-1))
                return "" + data.rows[random_id]["long_url"];
            })
        await ctx.redirect(long_url);

    }else if(ctx.request.url !== "/favicon.ico"){
        const long_url = await ctx.app.pool.query('SELECT long_url FROM urls WHERE short_url = $1;',[ctx.request.params.short_suffix])
            .then(function (data){
                return  "" + data.rows[0]["long_url"];
            })
        await ctx.redirect(long_url);
    }else{}
})

