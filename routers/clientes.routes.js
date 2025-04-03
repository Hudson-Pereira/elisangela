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
        
        let hoje = new Date();   
        hoje = moment(hoje).locale('pt-br').format('DD/MM/YYYY');
        let dia = hoje.slice(0,2)
        let mes = hoje.slice(3,5)
        let ano = hoje.slice(6)

        let agenda = await prisma.agenda.findMany({
            orderBy:[
                {data: 'asc'}, 
                {hora: 'asc'}
                ]
            }) 

            const agendaFiltrada = agenda.filter(item => {
                let itemAno = item.data.slice(6)
                if(itemAno == ano){
                    let itemMes = item.data.slice(3,5)
                    if(itemMes >= mes){
                        let itemDia = item.data.slice(0,2)
                        if(itemDia >= dia)
                            return item
                    }
                }
            });

        
        res.status(200).render('clientes/agenda', {
            agenda: agendaFiltrada,
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

        let hoje = new Date();   
        hoje = moment(hoje).locale('pt-br').format('DD/MM/YYYY');
        let dia = hoje.slice(0,2)
        let mes = hoje.slice(3,5)
        let ano = hoje.slice(6)

        let agenda = await prisma.agenda.findMany({
            orderBy:[
                {data: 'asc'}, 
                {hora: 'asc'}
                ]
            }) 

            const agendaFiltrada = agenda.filter(item => {
                let itemAno = item.data.slice(6)
                if(itemAno == ano){
                    let itemMes = item.data.slice(3,5)
                    if(itemMes >= mes){
                        let itemDia = item.data.slice(0,2)
                        if(itemDia >= dia)
                            return item
                    }
                }
            });

        res.status(200).render('clientes/agenda', {agenda: agendaFiltrada, message: `Agendamento concluido!!`})
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
//TODO: criar funcao externa para formatar data e filtrar agenda
router.post('/search', async (req, res) => {
    try {
        let {search} = req.body

        let hoje = new Date();   
        hoje = moment(hoje).locale('pt-br').format('DD/MM/YYYY');
        let dia = hoje.slice(0,2)
        let mes = hoje.slice(3,5)
        let ano = hoje.slice(6)

        if(!search){
        
        let agenda = await prisma.agenda.findMany({
            orderBy:[
                {data: 'asc'}, 
                {hora: 'asc'}
                ]
            }) 

            const agendaFiltrada = agenda.filter(item => {
                let itemAno = item.data.slice(6)
                if(itemAno == ano){
                    let itemMes = item.data.slice(3,5)
                    if(itemMes >= mes){
                        let itemDia = item.data.slice(0,2)
                        if(itemDia >= dia)
                            return item
                    }
                }
            });

            return res.status(200).render('clientes/agenda', {agenda: agendaFiltrada, message:``})
        }

        search = moment(search).locale('pt-br').format('DD/MM/YYYY');

        const agenda = await prisma.agenda.findMany({where:{data: search}, orderBy:[{data: 'asc'}, {hora: 'asc'}]})
        
        res.status(200).render('clientes/agenda', {agenda: agenda, message: ``})
    } catch (err) {
        console.error(`Rota post /search ${err.message}`)
        res.status(200).render('clientes/agenda', {message:``})
    }
})
module.exports = router