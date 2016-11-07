var koaRequest = require('koa-request');
var pg = require('pg');
var connectionString = 'postgres://postgres:pass123@localhost:5432/test';

var client = new pg.Client(connectionString);
client.connect();

var StoryModel = {
  serviceUrl: 'https://hacker-news.firebaseio.com/v0/',

  getStoriesFromService: function* () {
    var url = this.serviceUrl+'newstories.json?print=pretty'
    var request = yield koaRequest(url);
    var data = Buffer(request.body);
    var result = [];
    data = JSON.parse(data);

    var i = 0;
    for (id of data) {
      var story = yield this.getItemFromServiceById(id);
      story = JSON.parse(story);
      // add only live stories
      if (story && !story.deleted && !story.dead) {
        result.push(story);
        i++;
        yield this.insertItemToDb(story);
        if (story.kids && story.kids.length > 0) {
          var j = 0;
          for (kidId of story.kids) {
            var item = yield this.getItemFromServiceById(kidId);
            itemInsertedResult = yield this.insertItemToDb(item);
            if (itemInsertedResult) {
              j++;
            }
            if (j >= 50) {
              break;
            }
          }
        }
      }
      // get just 10 stories
      if (i == 10) {
        break;
      }
    }

    return(result);
  },

  getItemFromServiceById: function* (id) {
    var url = this.serviceUrl+'item/'+id+'.json?print=pretty'
    var request = yield koaRequest(url);
    var data = Buffer(request.body);
    data = data.toString();
    return(data);
  },

  getStoriesFromDb: function* () {
    var result = [];
    var itemsFromDb = yield client.query('SELECT * FROM items ORDER BY id DESC LIMIT 10');
    var rows = itemsFromDb.rows;
    for (item of rows) {
      var keys = Object.keys(item);
      var tempItem = {}
      for (key of keys) {
        if (item[key]) {
          tempItem[key] = item[key].trim();
        } else {
          tempItem[key] = '';
        }
      }
      result.push(tempItem);
    }
    result = JSON.stringify(result);
    return result;
  },

  getItemFromDbById: function* (id) {
    var result = {};
    id = (id + '   ').substring(0, 10);
    var itemsFromDb = yield client.query("SELECT * FROM items WHERE id = '"+id+"'");
    result = itemsFromDb.rows[0];
    var keys = Object.keys(result);
    for (key of keys) {
      if (result[key]) {
        result[key] = result[key].trim();
      } else {
        result[key] = '';
      }
    }
    result = JSON.stringify(result);
    return result;
  },

  insertItemToDb: function* (item) {
    // id, deleted, type, by, time, text, dead, parent, kids, url, score, title, parts, descendants
    var keys = ['id', 'deleted', 'type', 'by', 'time', 'text', 'dead', 'parent', 'kids', 'url', 'score', 'title', 'descendants'];
    for (key of keys) {
      if (!item[key]) {
        item[key] = '';
      }
    }
    // check if item presents in DB
    id = (item.id + '   ').substring(0, 10);
    var itemsFromDb = yield client.query("SELECT id FROM items WHERE id = '"+id+"'");
    if (itemsFromDb.rows && itemsFromDb.rowCount >= 1) {
      return(true);
    }

    var queryToInsert = 'INSERT into items (id, deleted, type, by, time, text, dead, parent, kids, url, score, title, descendants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id';
    try {
      var resultFromDb = yield client.query(queryToInsert, [item.id, item.deleted, item.type, item.by, item.time, item.text, item.dead, item.parent, item.kids, item.url, item.score, item.title, item.descendants]);
    }
    catch (err) {
      return(false);
    }
    if (!resultFromDb.rows[0].id) {
      return(false);
    } else {
      return(true);
    }
  }

}

module.exports = StoryModel;

