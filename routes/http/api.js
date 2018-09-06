"use strict";

const
  express = require('express'),
  request = require('request'),
  config = require('config'),
  crypto = require('crypto'),
	util = require('util');
	
let router = express.Router();

router.get('/', (req, res, next) => {
  console.log(req.params);
  res.json(req.params);
});

module.exports = router;