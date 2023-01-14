DROP TABLE IF EXISTS urls;
CREATE TABLE urls (id SERIAL PRIMARY KEY, long_url TEXT NOT NULL, short_url TEXT NOT NULL);
INSERT INTO urls (long_url, short_url) VALUES ('https://open.spotify.com/track/5uSG2qFsXcAG1QV5D5jmML?si=a5f51986b54e42c7', 'jvjxi6')