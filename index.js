const express = require("express");
const session = require("express-session");
const MemoryStore = require('memorystore')(session)
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

const passport = require("passport");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

require('./auth')(passport);
app.use(session({
    store: new MemoryStore({
        checkPeriod: 1800000,
        ttl: 3600000
    }),
    secret: '123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000}
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join("./")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function authenticationMiddleware(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login?fail=true')
}

app.get('/', (req, res) => {
    res.redirect('/cliente')
});//depois de pronta a tela sobre, mudar para ela o redirect

const LoginRouter = require("./routers/login.routes");
app.use("/login", LoginRouter);

const InicioRouter = require("./routers/inicio.routes")
app.use('/admin', authenticationMiddleware, InicioRouter)

const ProdutoRouter = require("./routers/produto.routes");
app.use("/produto", authenticationMiddleware, ProdutoRouter);

const ServicoRouter = require("./routers/servico.routes");
app.use("/servicos", authenticationMiddleware, ServicoRouter);

const AgendaRouter = require("./routers/agenda.routes");
app.use("/agenda", authenticationMiddleware, AgendaRouter);

const CaixaRouter = require("./routers/caixa.routes");
app.use("/caixa", authenticationMiddleware, CaixaRouter);

const ClienteRouter = require("./routers/clientes.routes");
app.use("/cliente", ClienteRouter)

app.listen(process.env.PORT, () => {
  console.log(`Rodando em http://localhost:${port}.`);
});
