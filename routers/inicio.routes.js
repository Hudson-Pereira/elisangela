const express = require('express');
const router = express.Router();
const passport = require('passport')

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
    try {
      let hoje = new Date();
      const dia = hoje.getDate().toString().padStart(2,"0");
      let mes = hoje.getMonth() + 1
      if(mes.length !== 2) mes = `0${mes}`
      const ano = hoje.getFullYear();
  
      hoje = `${ano}-${mes}-${dia}`;
      const hojeS = hoje.toString();
  
      let produtos = await prisma.produtos.findMany({});
      let agendas = await prisma.agenda.findMany({ where: { data: hojeS } });
  
      produtos = produtos.filter((produto) => {
        if (produto.data > hoje) {
          
          const mesP = parseInt(produto.data.slice(5, 8).toString());
          const mesA = parseInt(hojeS.slice(5, 8));
          const anoP = parseInt(produto.data.slice(0, 4).toString())
          const anoA = parseInt(hojeS.slice(0, 4));
          if (anoP >= anoA) {
            if (mesP <= mesA + 2) {
              return produto
            }
          }
        }
      });
  
      res.status(200).render("inicio", { agendas: agendas, produtos: produtos, message: `` });
    } catch (err) {
      console.error(`Rota /: ${err.message}`);
      throw new Error("Erro!!!!");
    }
  });

module.exports = router