# Cool URL Shortener 😎

## Instructions ✅

### Run the containers 🚢

Once you downloaded and extracted the __.zip__ to your computer, 
open a terminal and locate the directory:

`cd coolshortener`

Make sure your Docker daemon is running, then just run the following command:

`docker compose up`

This will create 4 containers, which are 3 applications and 1 database.
If you run `docker ps` you should be able to see them:

1. __cool-koa__ - application in Koa Framework (JavaScript).
2. __cool-flask__ - application in Flask Framework (Python).
3. __cool-express__ - application in Express Framework (JavaScript).
4. __cool-db__ - PostgreSQL database

### Try the apps 🧑🏻‍💻

To see the apps in action do the following changing the port accordingly:
Koa Port = `3001`, Express Port = `3000`, Flask = `5000`

1. Go to the main page `http://localhost:PORT/` and paste a long URL, then click __Get Cool URL__.
2. That will redirect you to a page (`http://localhost:PORT/show_shortened`) showing both the long URL and the new short one, click the short one to try the redirection.
3. Try the random function by typing `http://localhost:PORT/random`, that will send you to a random page.

### Run the tests 📊

Make sure you are still in the right directory in your terminal, go to the tests folder by typing:

`cd tests`

Run the following command to get K6's image in docker:

`docker pull grafana/k6`

There are 4 scripts files, each of them have 3 tests, one for each implementation, 
so you must specify which one you want to test with an environment variable.

#### Main page tests
Koa: `docker run --rm -i grafana/k6 run - <script-main-page.js -e HOST=KOA`

Express: `docker run --rm -i grafana/k6 run - <script-main-page.js -e HOST=EXPRESS`

Flask: `docker run --rm -i grafana/k6 run - <script-main-page.js -e HOST=FLASK`

#### Storing URL in the DB tests
Koa: `docker run --rm -i grafana/k6 run - <script-storing-db.js -e HOST=KOA`

Express: `docker run --rm -i grafana/k6 run - <script-storing-db.js -e HOST=EXPRESS`

Flask: `docker run --rm -i grafana/k6 run - <script-storing-db.js -e HOST=FLASK`

#### Redirection to a URL tests
Koa: `docker run --rm -i grafana/k6 run - <script-redirection.js -e HOST=KOA`

Express: `docker run --rm -i grafana/k6 run - <script-redirection.js -e HOST=EXPRESS`

Flask: `docker run --rm -i grafana/k6 run - <script-redirection.js -e HOST=FLASK`

#### Random URL tests
Koa: `docker run --rm -i grafana/k6 run - <script-random.js -e HOST=KOA`

Express: `docker run --rm -i grafana/k6 run - <script-random.js -e HOST=EXPRESS`

Flask: `docker run --rm -i grafana/k6 run - <script-random.js -e HOST=FLASK`

## Test Results 💯

The parameters of the tests were: 100 concurrent users for 30 seconds. All tests were run individually.

### Main page

Koa
>http_reqs......................: 1460   45.618334/s
> 
>http_req_duration..............: avg=119.65ms med=39.6ms   p(95)=697.27ms p(99)=716.51ms

Express
>http_reqs......................: 1500   48.073766/s
>
>http_req_duration..............: avg=49.08ms  med=14.57ms  p(95)=320.65ms p(99)=668.14ms

Flask
>http_reqs......................: 1500   48.348607/s
> 
> http_req_duration..............: avg=37.09ms med=21.22ms  p(95)=151.15ms p(99)=225.86ms

### Storing URL in DB

Koa
>http_reqs......................: 1452   45.313618/s
> 
> http_req_duration..............: avg=127.21ms med=74.34ms  p(95)=493.85ms p(99)=813.38ms

Express
>http_reqs......................: 1500   47.609491/s
> 
> http_req_duration..............: avg=57.58ms  med=19.44ms  p(95)=331.69ms p(99)=636.18ms

Flask
>http_reqs......................: 1395   43.265473/s
> 
> http_req_duration..............: avg=232.94ms med=163.94ms p(95)=743.13ms p(99)=1.33s

### Redirection to URL

Koa
>http_reqs......................: 2052   60.902668/s
> 
> http_req_duration..............: avg=517.53ms med=488.55ms p(95)=1.6s     p(99)=2.56s

Express
>http_reqs......................: 2062   62.703142/s
> 
> http_req_duration..............: avg=492.91ms med=471.84ms p(95)=1.44s    p(99)=2.64s

Flask
>http_reqs......................: 1686   50.324196/s
> 
> http_req_duration..............: avg=842.77ms med=782.91ms p(95)=1.7s     p(99)=2.6s

### Random URL

Koa
>http_reqs......................: 1894   58.063459/s
> 
>http_req_duration..............: avg=625.35ms med=583.16ms p(95)=2.12s    p(99)=3.18s

Express
>http_reqs......................: 2026   61.905252/s
> 
>http_req_duration..............: avg=540.88ms med=584.39ms p(95)=1.49s    p(99)=2.41s

Flask
>http_reqs......................: 1486   40.768626/s
> 
>http_req_duration..............: avg=1.08s    med=1.03s    p(95)=2.32s    p(99)=4.11s


## Test Analysis 🔍
In the first test Flask is the fastest of all three, 
I think that happens because Koa uses asynchronous methods and
as well as Express, they both transform pug code to HTML code
to render the main page, while flask doesn't. 

In the second tests Express is the fastest, again I think Koa is losing because the async methods.
Flasks did worse this time, and I think it has to be with the way 
it handles database connections, making a new one each call
and closing it everytime, against Koa and Express which only use one 
pool for all.

The last two tests are both redirection, we can again see how poorly
Flask does because of the DB connections. I didn't include logs in 
Express, while in Koa I did, maybe that extra step make Express win.

## Suggestions for improving performance 🪄
__Flask:__ Using a non-relational database like MongoDB can make the 
connections faster, because they're handled with models.

__Koa:__ I think the asynchronous methods can be handy in other kind
of implementations, using Koa for a simple API like this maybe is not worth it.

__Express:__ I would practice more to handle better the promises
of the pool queries, I think they aren't properly handled now, 
which may affect the performance somehow.

For both Express and Koa I would not use pug to render templates, maybe
it is easier to write, but it will be HTML code anyway.







