const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

//var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('stupid id inaccessible');
    } else {
      var filePath = path.join(`${exports.dataDir}/${id}.txt`);
      var message = text;
      fs.writeFile(filePath, message, (err) => {
        if (err) {
          throw err;
        } else {
          console.log('file is saved');
          //items[id] = text;
          callback(null, { id, text });
        }
      });
    }
    //console.log('our id inside the callback: ', id);
  });
  //console.log('this is the id:', id, 'and this is the text: ', text);
  //items[id] = text;
  //console.log('---------> items[id] = ', items[id]);
  //callback(null, { id, text });
};

/*
1) get text from form
2) create file with ID as name
3) write to file and save


*/

exports.readAll = (callback) => {
  var data = [];
  _.each(items, (text, id) => {
    data.push({ id, text });
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
