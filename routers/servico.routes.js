const express = require('express');
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    try {
        const servicos = await prisma.servicos.findMany({})
        res.status(200).render('servico', {servicos: servicos})
    } catch (err) {
        console.error(`Rota /servico ${err.message}`)
        throw Error("Erro!")
    }
})

router.get("/add", async (req, res) => {
    try {
        res.status(200).render('addServico')
    } catch (err) {
        console.error(`Rota /servico/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post("/add", async (req, res) => {
    try {
        let { nome, valor, produto, descricao, imagem } = req.body
        valor = parseFloat(valor)
        if(!valor) valor = 0
        await prisma.servicos.create({
            data: {
                nome, valor, produto, descricao, imagem
            },
        })
        res.status(200).redirect('/servicos')
    } catch(err) {
        console.error(`Rota post /servico/add: ${err.message}`)
        res.status(200).redirect('/servicos')
    }
})

router.get("/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const servico = await prisma.servicos.findUnique({ where: { id } })
        res.status(200).render('alterarServico', { servico: servico })
    } catch (err) {
        console.error(`Rota /servico/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post("/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        await prisma.servicos.update({
            where: { id },
            data: {
                nome: req.body.nome,
                descricao: req.body.descricao,
                valor: parseFloat(req.body.valor),
                produto: req.body.produto
            }
        })

        res.status(200).redirect('/servicos')
    } catch(err) {
        console.error(`Rota post /servico/alterar: ${err.message}`)
        res.status(200).redirect('/servicos')
    }
})

router.get("/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.servicos.delete({
            where: {
                id
            }
        })

        res.status(200).redirect('/servicos')
    } catch (err) {
        console.error(`Rota /servico/deletar ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

module.exports = router