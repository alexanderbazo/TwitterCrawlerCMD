# Twitter Crawler CLI

This project aims to implement a cli wrapper for basic operations againts twitter's REST api. Results are store into an sqlite database.

## Install

Clone this repository and run `npm install` to install dependencies. Create a new database using the provided schema (`sqlite/schema.sqlite`). If you have installed the sqlite cli tool this command should create the databse `sqlite3 DATABASENAME < sqlite/schema.sqlite`. 

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
| `--sqlite` | Store retrieved tweets into a sqlite database. If not value is given, results are stored in `tweets.sqlite` |
| `--html` | Resolves urls in tweets and stores html content in database. |
| `--sentistrength` | Augment results with sentiment scores (See above: Sentiment Detection). |
| `--auth` | Path to oauth file. If this option is ommitted, oauth information will be read from `auth.json` |


# Licences and Agreements

The code in this repository is provide under [MIT license](License.md). No twitter content is stored in or published through this repository. Make sure that your usage of this software complies to [Twitters Developer Agreement](https://dev.twitter.com/overview/terms/agreement-and-policy). Other licences may be applied to dependcies use to run this software.