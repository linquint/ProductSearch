import ast

from flask import Flask, render_template, request
from flask_mysqldb import MySQL
import http.client
from flask_cors import CORS
import json

from db.insert import insert_movie, fetch_reviews
from db.select import get_movie, get_movies_by_genre, does_media_exist, get_movie_id

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'N3zinau!'
app.config['MYSQL_DB'] = 'imdb_reviews'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['MYSQL_DATABASE_CHARSET'] = 'utf8mb4'
app.config['MYSQL_CHARSET'] = 'utf8mb4'
app.config['MYSQL_ENABLE_CLEAR_METADATA'] = True
app.config['MYSQL_CLIENT_FLAGS'] = ['-FOUND_ROWS', '-MULTI_STATEMENTS', '-BINARY']
mysql = MySQL(app)

# headers for OMDB API
headersOMDB = {
    'X-RapidAPI-Key': "3c28855955msh03796e646142a63p14bc99jsne913e6e6b778",
    'X-RapidAPI-Host': "movie-database-alternative.p.rapidapi.com"
}

headersDOJO = {
    'X-RapidAPI-Key': "3c28855955msh03796e646142a63p14bc99jsne913e6e6b778",
    'X-RapidAPI-Host': "online-movie-database.p.rapidapi.com"
}

# MySQL connection cursor (must be inside function)
# cursor = mysql.connection.cursor()

#
# mysql -p -Nse 'show tables' imdb_reviews
#   | while read table; do mysql -p -e "SET FOREIGN_KEY_CHECKS = 0; truncate table $table" imdb_reviews; done
#


@app.route('/')
def hello_world():  # put application's code here
    return render_template('search.html')


@app.route('/api/search', methods=['GET'])
def search_api():
    query = request.args.to_dict()
    conn = http.client.HTTPSConnection("movie-database-alternative.p.rapidapi.com")
    url = ("/?s=%s&r=json&page=1" % query.get('query')).replace(" ", "%20")
    conn.request("GET", url, headers=headersOMDB)
    res = conn.getresponse()
    data = res.read()
    conn.close()
    return data


@app.route('/api/details', methods=['GET'])
def details_api():
    query = request.args.to_dict()
    imdb_id = query.get('id')
    exists = does_media_exist(mysql, imdb_id)
    if not exists:
        conn = http.client.HTTPSConnection("omdbapi.com")
        url = ("/?apikey=d49b3253&type=movie&plot=full&i=%s" % imdb_id).replace(" ", "%20")
        conn.request("GET", url)
        res = conn.getresponse()
        data = res.read()
        conn.close()
        movie_id = insert_movie(mysql, data)

        # Get user reviews
        conn_dojo = http.client.HTTPSConnection("online-movie-database.p.rapidapi.com")
        conn_dojo.request("GET", "/title/get-user-reviews?tconst=%s" % imdb_id, headers=headersDOJO)
        res_dojo = conn_dojo.getresponse()
        data = res_dojo.read()
        conn_dojo.close()
        reviews = json.loads(data.decode('utf-8'))['reviews']
        fetch_reviews(mysql, reviews, movie_id)
    else:
        movie_id = get_movie_id(mysql, imdb_id)
    details = get_movie(mysql, movie_id)
    return details


@app.route('/api/genre', methods=['GET'])
def movies_by_genre():
    query = request.args.to_dict()
    data = get_movies_by_genre(mysql, query.get('genre'))
    return data


@app.route('/api/check', methods=['GET'])
def check_movie():
    query = request.args.to_dict()
    exists = does_media_exist(mysql, query.get('id'))
    return {exists: exists}


if __name__ == '__main__':
    app.run()
