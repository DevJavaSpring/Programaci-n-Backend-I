import {Router} from 'express';
import passport from 'passport';
import { createHash, isValidPassword } from '../../src/utils.js';

const sessionRouter = Router();

/**
 * ENDPONINT DE SESSION
 */ 
const {default : UserModel} = await import ('../models/user.model.js');

sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
    res.redirect("/login?nuevoUsuario=true");
    //res.send({ status: "success", message: "usuario registrado" })
});

sessionRouter.get('/failregister', async (req, res) => {
    console.log('Estrategia Passport, Para Registracion, Fallida');
    res.status(500).send({ code: 500, status: "error", message: "Error al registrar usuario en Estrategia Passport" });
})



sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), async (req, res) => {
    if (!req.user){
        return res.status(400).send({ code: 500, status: "error", error: "Credenciales invalidas" });
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    
    res.redirect('/profile');
});

sessionRouter.get('/faillogin', (req, res) => {
    console.log('Estrategia Passport, Para Registracion, Fallida');
    res.status(500).send({ code:500, status: "error", message: "Error al loggear usuario" });
})



sessionRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default sessionRouter;
