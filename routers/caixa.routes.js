const express = require('express');
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    try {
        res.status(200).render('fechamento', {message:``})
     } catch (err) {
        console.error(`Rota caixa: ${err.message}`)
        res.redirect('caixa')
    }
})

router.post("/", async (req, res) => {
    try {
        let dataI = req.body.dataI;
        let dataF = req.body.dataF;
        const servicos = await prisma.agenda.findMany({})
        const produtos = await prisma.produtos.findMany({})

        let entrada = 0
        let saida = 0
        servicos.filter((servico) => {
            if (servico.data >= dataI && servico.data <= dataF) {
                entrada = entrada + servico.preco
            }
        });

        dataI = dataI.split('-')
        dataI = new Date(dataI[0], dataI[1] -1, dataI[2])
        dataF = dataF.split('-')
        dataF = new Date(dataF[0], dataF[1] -1, dataF[2])
        
        produtos.filter((produto) => {
            
            if (produto.createdAt >= dataI || produto.createAt <= dataF) {
                saida = saida + produto.valor
            }
        })

        res.status(200).render('caixa', {
            dataI: req.body.dataI,
            dataF: req.body.dataF,
            entrada: entrada,
            saida: saida,
            message:``
        })
        
    } catch (err) {
        console.error(`Rota post /caixa ${err.message}`)
    }
})

module.exports = router
// TODO: refatorar??