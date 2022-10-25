const express = require("express")
const router = express.Router()
const ProdutoController = require("../controller/produto.controller")

router.get('/', ProdutoController.getAll);
router.get('/add', ProdutoController.getAdd);
router.post('/add', ProdutoController.postAdd);


module.exports = router