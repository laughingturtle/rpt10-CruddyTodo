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
  let id;
  fs.readdir(`${exports.dataDir}`, (err, files) => {
    // console.log('files: ', files);
    // map through the files
    // grab the id (extract) - then do an async readFile
    // in a then block return the text
    // in the next then return the promise.all

    files.forEach(file => {
      id = file.slice(0, -4);
      data.push(id);
      //console.log('data from in the forEach okay? ---> ', data);
    });
    var promises = data.map(id => {
      //console.log('file --> ', id);
      return new Promise((resolve, reject) => {
        //var filePath = path.join(`${exports.dataDir}/${id}.txt`);
        fs.readFile(path.join(`${exports.dataDir}/${id}.txt`), 'utf8', (err, text) => {
          if (err) {
            return reject(err);
          }
          //console.log('*******------->>>', id, text);
          resolve({id, text});
        });
      });
    });
    Promise.all(promises).then(function(values) {
      //console.log(' our fine values --------->', values);
      //solution.push({ id, text });
      callback(null, values);
    });
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
  var filePath = path.join(`${exports.dataDir}/${id}.txt`);
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////
exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
