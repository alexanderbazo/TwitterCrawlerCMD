# Twitter Crawler CLI

This project aims to implement a cli wrapper for basic operations againts twitter's REST api. While JSON and CSV output is available, the main use case is the persitence of tweets into a database.

## Install

Clone this repository and run `npm install` to install dependencies. Create a new database using the provided schema (`sqlite/schema.sqlite`).

## Config

Create a new app at https://apps.twitter.com/. Copy and rename `auth.json.example` to `auth.json` and insert the keys and tokens from your new app.

## Sentiment Detection

To prepare the sentiment detection add a folder `sentistrength` to the project. Copy the SentiStrength jar file to this folder and rename the jar to `sentistrength.jar`. Put any sentiment lookup file into a subfolder `data`.

## Usage

Run `node index.js <COMMAND>`

### Available Commands

| Command | Description |
| ------- | ----------- |
| `timeline` | Retrieve your current home timeline |

### Options

| Options | Description |
| ------- | ----------- |
| `--count` | Number of tweets to be retrieved |
| `--csv` | Save retrieved tweets to a csv file. If not value is given, results are stored in `results.csv` |
| `--json` | Save retrieved tweets as individual json files. If not value is given, results are stored in a subfolder named `results-json` |
| `--sqlite` | Store retrieved tweets into a sqlite database. If not value is given, results are stored in `tweets.sqlite` |
| `--sentistrength` | Augment results with sentiment scores (See above: *Sentiment Detection*). |
| `--auth` | Path to oauth file. If this option is ommitted, oauth information will be read from `auth.json` |