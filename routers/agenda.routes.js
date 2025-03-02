const express = require('express');
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    try { 
        const agenda = await prisma.agenda.findMany({})
        res.status(200).render('agenda', {
            agenda: agenda
        })
    } catch (err) {
        console.error(`Rota /agenda ${err.message}`)
    }
})

router.get("/add", async (req, res) => {
    try {
        res.status(200).render('addAgenda')
    } catch (err) {
        console.error(`Rota /agenda/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.get("/agenda/add", async (req, res) => {
    try {
        res.status(200).render('addAgenda')
    } catch (err) {
        console.error(`Rota /agenda/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post("/add", async (req, res) => {
    try {

        let { nome, data, hora, preco, procedimento } = req.body

        if (!preco) preco = 0;
        preco = parseFloat(preco)

        await prisma.agenda.create({
            data: {
                nome, data, hora, preco, procedimento
            },
        })
        //TODO:validar dados vazios
        res.status(200).redirect('/agenda')
    } catch(err) {
        console.error(`Rota post /agenda/add: ${err.message}`)
        res.status(200).redirect('/agenda')
    }
})

router.get('/alterar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const agenda = await prisma.agenda.findUnique({ where: { id } })
        res.status(200).render('alterarAgenda', { agenda: agenda })
    } catch (err) {
        console.error(`Rota /agenda/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post("/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        await prisma.agenda.update({
            where: { id },
            data: {
                nome: req.body.nome,
                data: req.body.data,
                hora: req.body.hora,
                preco: parseFloat(req.body.preco)
            }
        })

        res.status(200).redirect('/agenda')
    } catch(err) {
        console.error(`Rota post /agenda/alterar: ${err.message}`)
        res.status(200).redirect('/agenda')
    }
})

router.get("/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.agenda.delete({
            where: {
                id
            }
        })

        res.status(200).redirect('/agenda')
    } catch (err) {
        console.error(`Rota /agenda/deletar ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

module.exports = router