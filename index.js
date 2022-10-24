const bodyParser = require("body-parser");
const express = require("express")
const app = express()
const path = require("path"); 

require("dotenv").config();

const port = process.env.PORT || 3000
app.set("view engine", "ejs"); 
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({extended: false}));

const Connected = require("./models/conn/index")
app.use(express.json());

Connected()

app.get("/", (req, res) => { //Rota geral
    res.status(200).render('inicio');
});
  
const routerProdutos = require("./router/produtos.routes");
app.use("/produto", routerProdutos);

app.listen(process.env.PORT, () => {
    console.log(`Rodando em http://localhost:${port}.`);
  });