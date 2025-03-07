const express = require('express');
const router = express.Router();
const moment = require('moment');


const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    try { 
        const agenda = await prisma.agenda.findMany({})
        res.status(200).render('agenda', {
            agenda: agenda,
            message:``
        })
    } catch (err) {
        console.error(`Rota /agenda ${err.message}`)
    }
})

router.get("/add", async (req, res) => {
    try {
        res.status(200).render('addAgenda', {message: ``})
    } catch (err) {
        console.error(`Rota /agenda/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

// router.get("/agenda/add", async (req, res) => {
//     try {
//         res.status(200).render('addAgenda')
//     } catch (err) {
//         console.error(`Rota /agenda/add: ${err.message}`)
//         throw new Error("Erro!!!!")
//     }
// })

router.post("/add", async (req, res) => {
    try {
        let { nome, data, hora, preco, procedimento } = req.body

        if(!nome || !data || !hora)
            return res.status(200).render('agenda', {message: `Campos vazios!!`});

        data = moment(data).locale('pt-br').format('DD/MM/YYYY');

        const verifyIfExists = await prisma.agenda.findMany({where: {data: data, hora: hora}})

        if (verifyIfExists.length !== 0){
            return res.status(200).render('addAgenda', {message: `Horário não disponíve!!`});
        }

        if (!preco) preco = 0;
        preco = parseFloat(preco)
        
        await prisma.agenda.create({
            data: {
                nome, data, hora, preco, procedimento
            },
        })
        res.status(200).render('agenda', {message: `Agendamento concluido!!`})
    } catch(err) {
        console.error(`Rota post /agenda/add: ${err.message}`)
        res.status(200).redirect('agenda')
    }
})

router.get('/alterar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const agenda = await prisma.agenda.findUnique({ where: { id } })
        res.status(200).render('alterarAgenda', { agenda: agenda, message: `` })
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
                data: moment(req.body.data).locale('pt-br').format('DD/MM/YYYY'),
                hora: req.body.hora,
                preco: parseFloat(req.body.preco)
            }
        })

        res.status(200).render('agenda', {message: `Entrada alterada!!`})
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

        res.status(200).render('agenda', {message: `Entrada excluida!!`})
    } catch (err) {
        console.error(`Rota /agenda/deletar ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post('/search', async (req, res) => {
    try {
        let {search} = req.body

        if(!search){
            const agenda = await prisma.agenda.findMany()

            return res.status(200).render('agenda', {agenda: agenda, message:``})
        }

        let date = moment(search).locale('pt-br').format('DD/MM/YYYY');

        const agenda = await prisma.agenda.findMany({where:{data: date}})
        
        res.status(200).render('agenda', {agenda: agenda, message: ``})
    } catch (err) {
        console.error(`Rota post /search ${err.message}`)
        res.status(200).render('agenda', {message:``})
    }
})

module.exports = router