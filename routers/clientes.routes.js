const express = require('express');
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get('/', (req, res) => {
    try { 
        res.status(200).render('./clientes/sobre')
    } catch (err) {
        console.error(`Rota /sobre: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/agenda', async (req, res) => {
    try { 
        const agenda = await prisma.agenda.findMany({})
        res.status(200).render('./clientes/agenda', {
            agenda: agenda
        })
    } catch (err) {
        console.error(`Rota /cliente/agenda: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/agenda/add', async (req, res) => {
    try {
        res.status(200).render('./clientes/addAgenda')
    } catch (err) {
        console.error(`Rota /cliente/agenda/add: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.post('/add', async (req, res) => {
    try {
        let { nome, data, hora, preco, procedimento } = req.body
        if (!preco) preco = 0;
        preco = parseFloat(preco)

        const agenda = await prisma.agenda.findMany({
            where: {
                data: data,
                hora: hora
            }
        })
        console.log(agenda)//colocar validacao de hora
        
        // await prisma.agenda.create({
        //     data: {
        //         nome, data, hora, preco, procedimento
        //     },
        // })
        res.status(200).redirect('/cliente/agenda')
    } catch (err) {
        console.error(`Rota /cliente/add: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.get('/infos', (req, res) => {
    try { 
        res.status(200).render('./clientes/infos')
    } catch (err) {
        console.error(`Rota /infos: ${err.message}`);
      throw new Error("Erro!!!!");
    }
})

router.post('/search', async (req, res) => {
    try {
        let {search} = req.body
        console.log("🚀 ~ file: clientes.routes.js:67 ~ router.get ~ search", search)

        const agenda = await prisma.agenda.findMany({ where: { data: search  } })
        console.log("🚀 ~ file: clientes.routes.js:68 ~ router.get ~ agenda", agenda)
        res.status(200).render('./clientes/agenda', {agenda: agenda})
    } catch (err) {
        console.error(`Rota post /search ${err.message}`)
        res.status(200).redirect('/agenda')
    }
})

module.exports = router