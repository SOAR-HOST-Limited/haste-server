/*global require,module,process*/

var AWS = require('aws-sdk');
var winston = require('winston');

var AmazonS3DocumentStore = function(options) {
  this.expire = options.expire;
  this.bucket = options.bucket;
  this.endpoint = options.endpoint || null;
  this.accessKeyId = options.accessKeyId || null;
  this.secretAccessKey = options.secretAccessKey || null;

  // set up the configuration object for the AWS SDK
  var awsConfig = {
    region: options.region
  };

  if (this.endpoint) {
    awsConfig.endpoint = this.endpoint;
  }
  if (this.accessKeyId) {
    awsConfig.accessKeyId = this.accessKeyId;
  }
  if (this.secretAccessKey) {
    awsConfig.secretAccessKey = this.secretAccessKey;
  }

  this.client = new AWS.S3({region: options.region, endpoint: options.endpoint, accessKeyId: options.accessKeyId, secretAccessKey: options.secretAccessKey});
};

AmazonS3DocumentStore.prototype.get = function(key, callback, skipExpire) {
  var _this = this;

  var req = {
    Bucket: _this.bucket,
    Key: key
  };

  _this.client.getObject(req, function(err, data) {
    if(err) {
      callback(false);
    }
    else {
      callback(data.Body.toString('utf-8'));
      if (_this.expire && !skipExpire) {
        winston.warn('amazon s3 store cannot set expirations on keys');
      }
    }
  });
}

AmazonS3DocumentStore.prototype.set = function(key, data, callback, skipExpire) {
  var _this = this;

  var req = {
    Bucket: _this.bucket,
    Key: key,
    Body: data,
    ContentType: 'text/plain'
  };

  _this.client.putObject(req, function(err, data) {
    if (err) {
      callback(false);
    }
    else {
      callback(true);
      if (_this.expire && !skipExpire) {
        winston.warn('amazon s3 store cannot set expirations on keys');
      }
    }
  });
}

module.exports = AmazonS3DocumentStore;
