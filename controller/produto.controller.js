const { validationResult } = require("express-validator");
const Produto = require("../models/produtos");

exports.getAdd = (req, res) => {
    res.status(200).render('add')
}

exports.postAdd = async (req, res) => {
    
    await Produto.create(req.body).then(() => {
         
        res.status(201).redirect('/produto')
    })
                .catch((err) => {
                    res.status(400).json({ message: "Erro" })
                    console.error(err)
                })
            
}

exports.getAll = async (req, res) => {
    Produto.find({}).then((produtos) => {
        res.status(200).render('produto',{ produtos:produtos })
    }).catch((err) => {
        res.status(400).json({ message: "ERROR!!!!" });
        console.error(err);
      });
}
