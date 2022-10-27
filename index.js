import bodyParser from 'body-parser';
import express from 'express'
import path from 'path';
import { PrismaClient } from '@prisma/client';

const port = process.env.PORT || 3000
const prisma = new PrismaClient()
const app = express()

app.set("view engine", "ejs"); 
app.use(express.static(path.join("public"))); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// const Connected = require("./models/conn/index")
// Connected()

app.get("/", (req, res) => { //Rota geral
    res.status(200).render('inicio');
});

app.get("/produto", async (req, res) => {
    const produtos = await prisma.produtos.findMany({})
    res.status(200).render('produto', { produtos: produtos })
})

app.get("/produto/add", async (req, res) => {
    res.status(200).render('add')
})

app.post("/produto/add", async (req, res) => {
    const { nome, descricao, valor, vendedor, dia, mes, ano, estoque } = req.body
    const produtos = await prisma.produtos.create({
        data: {
            nome, descricao, valor, vendedor, dia, mes, ano, estoque
        },
    })
    res.status(200).redirect('/produto')
})

app.get("/produto/alterar/:id", async (req, res) => {
    const { id } = req.params
    const produto = await prisma.produtos.findUnique({where: { id }})
    res.status(200).render('alterar', {produto:produto})
})

app.post("/produto/alterar/:id", async (req, res) => {
    const { id } = req.params
    const produto = await prisma.produtos.update({
        where: { id },
        data: {
            nome: req.body.nome,
            descricao: req.body.descricao,
            valor: req.body.valor,
            dia: req.body.dia,
            mes: req.body.mes,
            ano: req.body.ano,
            vendedor: req.body.vendedor,
            estoque:req.body.estoque
        }
    })

    res.status(200).redirect('/produto')
})

app.get("/produto/deletar/:id", async (req, res) => {
    const { id } = req.params
    const produto = await prisma.produtos.delete({
        where: {
            id
        }
    })

    res.status(200).redirect('/produto')
})


app.listen(process.env.PORT, () => {
    console.log(`Rodando em http://localhost:${port}.`);
  });