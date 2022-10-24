const { validationResult } = require("express-validator");
const Produto = require("../models/produtos");

exports.postAdd = async (req, res) => {
    if (!req.body.nome) {
        res.status(400).json({ message: "Nome vazio." })
        return;
    }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    await Produto.create(req.body).then(() => {
         
        res.status(201).redirect('/produtos')
    })
                .catch((err) => {
                    res.status(400).json({ message: "Erro" })
                    console.error(err)
                })
            
}

exports.getAll = async (req, res) => {
    Produto.find().then((produtos) => {
        res.status(200).render('produto',{ produtos:produtos })
    })
}
