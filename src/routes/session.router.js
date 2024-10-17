import {Router} from 'express';
import { createHash, isValidPassword } from '../../src/utils.js';

const sessionRouter = Router();

/**
 * ENDPONINT DE SESSION
 */ 
const {default : UserModel} = await import ('../models/user.model.js');

sessionRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if(first_name || last_name || email || !age || !password ){
        return res.status(400).send({error: "400", status:"error", message:"valores incompletos "})
    }
    
    if(isNaN(Number(age))){
        return res.status(400).send({error: 400, status:"Parametro desconocido", message:"Parametro desconocido en edad, el parametro debe ser numerico"})
    }

    try {
        const userModel = new UserModel({ first_name, last_name, email, age, password: createHash(password) });
        await userModel.save();
        res.redirect("/login?nuevoUsuario=true");
        console.log("Se agrego un nuevo usuario con la id: "+ user._id);
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    }
});

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({ status: "error", error: "Valores incompletos" })
        }

        let userModelDTO = await UserModel.findOne({ email }, { email: 1, first_name: 1, last_name: 1, password: 1, age:1 });
        userModelDTO = userModelDTO.toObject();

        if (!userModelDTO) {
            return res.status(400).send({ status: "error", error: "Usuario no encontrado" });
        }

        if (!isValidPassword(userModelDTO, password)) {
            return res.status(403).send({ status: "error", error: "Password incorrecto" });
        }

        delete userModelDTO.password;
        req.session.user = userModelDTO;
    } catch (error) {
        console.error(error);
    }

    res.redirect('/profile');
});

sessionRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default sessionRouter;
