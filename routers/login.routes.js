const express = require('express');
const router = express.Router();
const passport = require('passport')

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient()

router.get("/", async (req, res, next) => {
    try {
        if (req.query.fail) {
            res.status(200).render('login', { message: 'Usuário e/ou senha incorretos!', title: "Login" });
        } else {
            res.status(200).render('login', { title: "Login", message: null })
        }
    } catch (err) {
        console.error(`Rota /login: ${err.message}`)
        throw new Error("Erro!!!!")
    }
})

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login?fail=true'
    }));

module.exports = router