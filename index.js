import express from 'express'
import path from 'path';
import { PrismaClient } from '@prisma/client';

const port = process.env.PORT || 3000
const prisma = new PrismaClient()
const app = express()

app.set("view engine", "ejs"); 
app.use(express.static(path.join("./"))); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/", (req, res) => { 
    try {
        res.status(200).render('inicio');
    } catch (err) {
        console.error(`Rota /: ${err.message}`)
        throw new Error("Erro!!!!")
    }
});

app.get("/produto", async (req, res) => {
    try {
        const produtos = await prisma.produtos.findMany({})
        res.status(200).render('produto', { produtos: produtos })
    } catch (err) {
        console.error(`Rota /produto: ${err.message}`)
        throw new Error("Erro!!!!")
    }
    })

app.get("/produto/add", async (req, res) => {
    try {
        res.status(200).render('addProduto')
    } catch (err) {
        console.error(`Rota /produto/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.post("/produto/add", async (req, res) => {
    try {
        let { nome, descricao, valor, vendedor, dia, mes, ano, estoque } = req.body
        valor = parseFloat(valor)
        dia = parseInt(dia)
        mes = parseInt(mes)
        ano = parseInt(ano)
        estoque = parseInt(estoque)

        await prisma.produtos.create({
            data: {
                nome, descricao, valor, vendedor, dia, mes, ano, estoque
            },
        })
        res.status(200).redirect('/produto')
    } catch(err) {
        console.error(`Rota post /produto/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.get("/produto/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.produtos.findUnique({ where: { id } })
        res.status(200).render('alterarProduto', { produto: produto })
    } catch (err) {
        console.error(`Rota /produto/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.post("/produto/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.produtos.update({
            where: { id },
            data: {
                nome: req.body.nome,
                descricao: req.body.descricao,
                valor: parseFloat(req.body.valor),
                dia: parseInt(req.body.dia),
                mes: parseInt(req.body.mes),
                ano: parseInt(req.body.ano),
                vendedor: req.body.vendedor,
                estoque: parseInt(req.body.estoque)
            }
        })

        res.status(200).redirect('/produto')
    } catch(err) {
        console.error(`Rota post /produto/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.get("/produto/deletar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.produtos.delete({
            where: {
                id
            }
        })

        res.status(200).redirect('/produto')
    } catch (err) {
        console.error(`Rota /:produto/deletar ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.get("/servicos", async (req, res) => {
    try {
        const servicos = await prisma.servicos.findMany({})
        res.status(200).render('servico', {servicos: servicos})
    } catch (err) {
        console.error(`Rota /servico ${err.message}`)
        throw Error("Erro!")
    }
})

app.get("/servicos/add", async (req, res) => {
    try {
        res.status(200).render('addServico')
    } catch (err) {
        console.error(`Rota /servico/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.post("/servicos/add", async (req, res) => {
    try {
        let { nome, valor, produto, descricao } = req.body
        valor = parseFloat(valor)
        await prisma.servicos.create({
            data: {
                nome, valor, produto, descricao
            },
        })
        res.status(200).redirect('/servicos')
    } catch(err) {
        console.error(`Rota post /servico/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.get("/servico/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const servico = await prisma.servicos.findUnique({ where: { id } })
        res.status(200).render('alterarServico', { servico: servico })
    } catch (err) {
        console.error(`Rota /servico/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.post("/servico/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.servicos.update({
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
        throw new Error("Erro!!!!")
    }
})

app.get("/servico/deletar/:id", async (req, res) => {
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

app.get("/agenda", async (req, res) => {
    try { 
        const agenda = await prisma.agenda.findMany({})
        res.status(200).render('agenda', {
            agenda: agenda
        })
    } catch (err) {
        console.error(`Rota /agenda ${err.message}`)
    }
})

app.get("/agenda/add", async (req, res) => {
    try {
        res.status(200).render('addAgenda')
    } catch (err) {
        console.error(`Rota /agenda/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.post("/agenda/add", async (req, res) => {
    try {
        let { nome, data, hora } = req.body
        
        await prisma.agenda.create({
            data: {
                nome, data, hora
            },
        })
        res.status(200).redirect('/agenda')
    } catch(err) {
        console.error(`Rota post /agenda/add: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.get('/agenda/alterar/:id', async (req, res) => {
    try {
        const { id } = req.params
        const agenda = await prisma.agenda.findUnique({ where: { id } })
        res.status(200).render('alterarAgenda', { agenda: agenda })
    } catch (err) {
        console.error(`Rota /agenda/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.post("/agenda/alterar/:id", async (req, res) => {
    try {
        const { id } = req.params
        const produto = await prisma.agenda.update({
            where: { id },
            data: {
                nome: req.body.nome,
                data: req.body.data,
                hora: req.body.hora
            }
        })

        res.status(200).redirect('/agenda')
    } catch(err) {
        console.error(`Rota post /agenda/alterar: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

app.get("/agenda/deletar/:id", async (req, res) => {
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



//TODO:fazer as automatizações e validações depois ajustes css
app.listen(process.env.PORT, () => {
    console.log(`Rodando em http://localhost:${port}.`);
  });