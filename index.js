const express = require('express');
const path= require('path');
const {PrismaClient} = require('@prisma/client');

const port = process.env.PORT || 3000
const prisma = new PrismaClient()
const app = express()

app.set("view engine", "ejs"); 
app.set("views","./views")
app.use(express.static(path.join("./"))); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//
app.get("/", async (req, res) => { 
    try {
        let hoje = new Date()
        const dia = hoje.getDate()
        const mes = hoje.getMonth() + 1
        const ano = hoje.getFullYear()
        
        hoje = `${ano}-${mes}-${dia}`
        const hojeS = hoje.toString()

        let produtos = await prisma.produtos.findMany({})
        let agendas = await prisma.agenda.findMany({where:{data: hojeS}})

        produtos = produtos.filter((produto) => {
            if (produto.data > hoje) {
                const mesP = parseInt(produto.data.slice(5, 8).toString());
                const mesA = parseInt(hojeS.slice(5, 8));
                if (mesP > mesA && mesP <= mesA + 2 ) {
                    return produto
                }
            }
        })

        res.status(200).render('inicio',{agendas: agendas, produtos:produtos});
    } catch (err) {
        console.error(`Rota /: ${err.message}`)
        throw new Error("Erro!!!!")
    }
});

const ProdutoRouter = require("./routers/produto.routes")
app.use("/produto", ProdutoRouter);

const ServicoRouter = require("./routers/servico.routes")
app.use("/servicos", ServicoRouter);

const AgendaRouter = require("./routers/agenda.routes")
app.use("/agenda", AgendaRouter);

const CaixaRouter = require("./routers/caixa.routes")
app.use("/caixa", CaixaRouter);

app.listen(process.env.PORT, () => {
    console.log(`Rodando em http://localhost:${port}.`);
  });