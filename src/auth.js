const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("./lib/client");

exports.login = async function(req, res) {
  console.log(req.body);
  return res.json({
    status: true,
    message: "login"
  });
};

exports.register = async function(req, res) {
  console.log(req.body);
  const body = req.body;
  if (!(body.email && body.password)) {
    return res.status(400).send({
      errors: {
        message: "Data not formatted properly"
      }
    });
  }
  const result = await client.register(body.email, body.password);
  return res.json({
    message: "hash",
    result
  });
};

exports.verify = async function(req, res) {
  console.log(req.body);
  return res.json({
    status: true,
    message: "verify"
  });
};

exports.webhook = async function(req, res) {
  console.log(req.body);
  return res.json({
    status: true,
    message: "webhook"
  });
};

exports.me = async function(req, res) {
  console.log(req.body);
  return res.json({
    status: true,
    message: "me"
  });
};
