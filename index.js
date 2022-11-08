import express from 'express'
import path from 'path';
import { PrismaClient } from '@prisma/client';

const port = process.env.PORT || 3000
const prisma = new PrismaClient()
const app = express()

app.set("view engine", "ejs"); 
app.set("views","./views")
app.use(express.static(path.join("./"))); 
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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
        let { nome, descricao, valor, vendedor, data, estoque } = req.body
        valor = parseFloat(valor)
        estoque = parseFloat(estoque)

        await prisma.produtos.create({
            data: {
                nome, descricao, valor, vendedor, data, estoque
            },
        })
        res.status(200).redirect('/produto')
    } catch(err) {
        console.error(`Rota post /produto/add: ${err.message}`)
        res.status(200).redirect('/produto')
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
        await prisma.produtos.update({
            where: { id },
            data: {
                nome: req.body.nome,
                descricao: req.body.descricao,
                valor: parseFloat(req.body.valor),
                data: req.body.data,
                vendedor: req.body.vendedor,
                estoque: parseFloat(req.body.estoque)
            }
        })

        res.status(200).redirect('/produto')
    } catch(err) {
        console.error(`Rota post /produto/alterar: ${err.message}`)
        res.status(200).redirect('/produto')
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
        res.status(200).redirect('/servicos')
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
        let { nome, data, hora, preco } = req.body
        preco = parseFloat(preco)
        
        await prisma.agenda.create({
            data: {
                nome, data, hora, preco
            },
        })
        res.status(200).redirect('/agenda')
    } catch(err) {
        console.error(`Rota post /agenda/add: ${err.message}`)
        res.status(200).redirect('/agenda')
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

app.get("/caixa", async (req, res) => {
    try {
        res.status(200).render('fechamento')
     } catch (err) {
        console.error(`Rota caixa: ${err.message}`)
        res.redirect('caixa')
    }
})

app.post("/caixa", async (req, res) => {
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
            saida: saida
        })
        
    } catch (err) {
        console.error(`Rota post /caixa ${err.message}`)
    }
})
//TODO:mensagens na pagina inicial, deploy
app.listen(process.env.PORT, () => {
    console.log(`Rodando em http://localhost:${port}.`);
  });