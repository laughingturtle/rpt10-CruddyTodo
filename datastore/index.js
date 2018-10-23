const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

//var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId(function(err, id) {
    if (err) {
      throw ('stupid id inaccessible');
    } else {
      var filePath = path.join(`${exports.dataDir}/${id}.txt`);
      var message = text;
      fs.writeFile(filePath, message, (err) => {
        if (err) {
          // throw err;
          callback(err, null);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var data = [];
  fs.readdir(`${exports.dataDir}`, (err, files) => {
    files.forEach(file => {
      let id = file.slice(0, -4);
      let text = id;
      data.push({ id, text });
    });
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  exports.readAll((err, filesArr) => {
    let found = false;
    filesArr.forEach(file => {
      if (id === file.id) {
        found = true;
        var filePath = path.join(`${exports.dataDir}/${id}.txt`);
        fs.readFile(filePath, 'utf8', (err, text) => {
          callback(null, { id, text });
        });
      }
    });
    if (!found) {
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(`${exports.dataDir}/${id}.txt`);
  fs.readFile(filePath, 'utf8', function(err, originalText) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        callback(null, { id, text });
      });
    }
  });
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
