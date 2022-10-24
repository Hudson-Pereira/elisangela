const mongoose = require("mongoose")

const produtoModel = new mongoose.Schema({
    nome: { type: String, required: true },
    valor: {type: Number, required: false}
})

const Produto = mongoose.model("Produtos", produtoModel)

module.exports = Produto