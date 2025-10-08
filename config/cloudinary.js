const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: 'ddgcvrsqs',
  api_key: '678764753269415',
  api_secret: 'O1WUjNcf4K8CsRNrkNAMciW_9_U',
});

module.exports = cloudinary;
