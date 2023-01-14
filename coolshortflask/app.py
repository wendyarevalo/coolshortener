from flask import Flask, render_template, request, url_for, redirect
from dotenv import load_dotenv
import psycopg2
import random
import string
import os

load_dotenv()

# database config (fix with env variables)
def get_db_connection():
    conn = psycopg2.connect(host=os.environ['PGHOST'],
                            port=os.environ['PGPORT'],
                            database=os.environ['PGDATABASE'],
                            user=os.environ['PGUSER'],
                            password=os.environ['PGPASSWORD'])
    return conn


def get_short_url():
    return ''.join(random.choice(string.ascii_letters) for i in range(6))


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/show_shortened', methods=['POST'])
def show_shortened():
    long_url = request.form.get('long_url')
    short_url = get_short_url()
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO urls (long_url, short_url) VALUES (%s, %s);',
                (long_url, short_url))
    conn.commit()
    cur.close()
    conn.close()
    return render_template('newurl.html', long_url=long_url, short_url=('http://localhost:5000/'+short_url))


@app.route('/<short_suffix>')
def redirect_shortened(short_suffix):
    if short_suffix != "favicon.ico":
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT long_url FROM urls WHERE short_url = %s;", (short_suffix,))
        long_urls = cur.fetchmany(1)
        cur.close()
        conn.close()
        return redirect(long_urls[0][0])

@app.route('/random')
def redirect_random():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT long_url FROM urls;")
    long_urls = cur.fetchall()
    random_id = random.randint(0, len(long_urls)-1)
    cur.close()
    conn.close()
    return redirect(long_urls[random_id][0])


if __name__ == '__main__':
    app.run()
