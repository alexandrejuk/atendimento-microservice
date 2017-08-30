const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Atendimentos = require('../models/atendimentos');
const { prop } = require('ramda');

const storage = multer.diskStorage({
  destination: 'public/images',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

const uploadingHandler = multer({
  limits: {fileSize: 1000000, files:1},
  storage: storage,
}).single("file");

const atendimentoUpload = ( req, res, next ) => {
    const id = prop("id", req.params);
    const filename = prop("filename", req.file);

    Atendimentos.findById(id)
    .then(atendimento => {
        atendimento.imagens.push(filename);
        return atendimento.save();
    })
    .then(atendimento => res.json(atendimento))
    .catch(error => next(error));
    
};

module.exports = {
    atendimentoUpload, 
    uploadingHandler
}
