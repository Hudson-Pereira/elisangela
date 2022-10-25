const mongoose = require("mongoose")

const produtoModel = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: {type: String, required: false},
    valor: { type: Number, required: false },
    vendedor: { type: String, required: false },
    dia: { type: Number, required: true },
    mes: { type: Number, required: true },
    ano: { type: Number, required: true },
    estoque: {type: Number, required: true}
    
})

const Produto = mongoose.model("Produtos", produtoModel)

module.exports = Produto