const express = require('express');
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    try {
        const produtos = await prisma.produtos.findMany({})
        res.status(200).render('produto', { produtos: produtos, message:`` })
    } catch (err) {
        console.error(`Rota /produto: ${err.message}`)
        throw new Error("Erro!!!!")
    }
    })

router.get("/add", async (req, res) => {
    try {
        res.status(200).render('addProduto', {message: ``})
    } catch (err) {
        console.error(`Rota /produto/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post("/add", async (req, res) => {
    try {
        let { nome, descricao, valor, vendedor, data, estoque } = req.body
        valor = parseFloat(valor)
        estoque = parseFloat(estoque)

        await prisma.produtos.create({
            data: {
                nome, descricao, valor, vendedor, data, estoque
            },
        })
        res.status(200).redirect('/produto', {message: `Produto adicionado!!`})
    } catch(err) {
        console.error(`Rota post /produto/add: ${err.message}`)
        res.status(200).redirect('/produto')
    }
})

router.get("/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.produtos.findUnique({ where: { id } })
        res.status(200).render('alterarProduto', { produto: produto, message:`` })
    } catch (err) {
        console.error(`Rota /produto/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post("/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        await prisma.produtos.update({
            where: { id },
            data: {
                nome: req.body.nome,
                descricao: req.body.descricao,
                valor: parseFloat(req.body.valor),
                data: req.body.data,
                vendedor: req.body.vendedor,
                estoque: parseFloat(req.body.estoque)
            }
        })

        res.status(200).redirect('/produto', {message: `Produto alterado com sucesso!!`})
    } catch(err) {
        console.error(`Rota post /produto/alterar: ${err.message}`)
        res.status(200).redirect('/produto')
    }
})

router.get("/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.produtos.delete({
            where: {
                id
            }
        })

        res.status(200).redirect('/produto', {message: `Produto deletado!!`})
    } catch (err) {
        console.error(`Rota /:produto/deletar ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

module.exports = router