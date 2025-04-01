const express = require('express');
const router = express.Router();
const moment = require('moment');

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
    try { 
        res.status(200).render('clientes/sobre', {message:``})
        // res.status(200).render(`clientes/home`, {message:``})
    } catch (err) {
        console.error(`Rota /sobre: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/agenda', async (req, res) => {
    try { 
        const agenda = await prisma.agenda.findMany({})
        res.status(200).render('clientes/agenda', {
            agenda: agenda,
            message:``
        })
    } catch (err) {
        console.error(`Rota /cliente/agenda: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/agenda/add', async (req, res) => {
    try {
        res.status(200).render('clientes/addAgenda', {message:``})
    } catch (err) {
        console.error(`Rota /cliente/agenda/add: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.post('/agenda/add', async (req, res) => {
    try {
        
        let { nome, data, hora, preco, procedimento } = req.body

        if(!nome || !data || !hora)
            return res.status(200).render('clientes/addAgenda', {message: `Campos vazios!!`});
        
        data = moment(data).locale('pt-br').format('DD/MM/YYYY');

        const verifyIfExists = await prisma.agenda.findMany({where: {data: data, hora: hora}})

        if (verifyIfExists.length !== 0){
            return res.status(200).render('clientes/addAgenda', {message: `Horário não disponíve!!`});
        }

        if (!preco) preco = 0;
        preco = parseFloat(preco)
        
        await prisma.agenda.create({
            data: {
                nome, data, hora, preco, procedimento
            },
        })
        res.status(200).render('clientes/addAgenda', {message: `Agendamento concluido!!`})
    } catch (err) {
        console.error(`Rota /cliente/add: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/infos', async (req, res) => {
    try { 
        const servicos = await prisma.servicos.findMany({})

        res.status(200).render('clientes/infos', {
            servicos: servicos,
            message: ``
        })
    } catch (err) {
        console.error(`Rota /infos: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.post('/search', async (req, res) => {
    try {
        let {search} = req.body

        if(!search){
            const agenda = await prisma.agenda.findMany()

            return res.status(200).render('clientes/agenda', {agenda: agenda, message:``})
        }

        let date = moment(search).locale('pt-br').format('DD/MM/YYYY');

        const agenda = await prisma.agenda.findMany({where:{data: date}})
        
        res.status(200).render('clientes/agenda', {agenda: agenda, message: ``})
    } catch (err) {
        console.error(`Rota post /search ${err.message}`)
        res.status(200).render('clientes/agenda', {message:``})
    }
})
module.exports = router