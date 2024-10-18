import passport from "passport";
import local from 'passport-local'
import userService from '../models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use(
        'register', 
        new LocalStrategy(
            { passReqToCallback: true, usernameField: 'email'}, 
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body;
                
                try {
                    if( typeof password === 'string' && password.trim().length === 0) {
                        //throw new Error("El password no debe ser unicamente espacios");
                        return req.res.status(400).send({code: 400, status: "Error", message: "El password no debe ser unicamente espacios" });
                    }
    
                    if(!first_name || !last_name || !email || !age ){
                        //throw new Error("Valores incompletos");
                        return req.res.status(400).send({code: 400, status: "Error", message: "Valores incompletos" });
                    }
                    
                    if(isNaN(Number(age))){
                        //throw new Error("Parametro desconocido en edad, el parametro debe ser numerico");
                        return req.res.status(400).send({code: 400, status: "Error", message: "Parametro desconocido en edad, el parametro debe ser numerico" });
                    }

                    let user = await userService.findOne({ email: username })
                    if (user) {
                        console.log("El usuario existe")
                        return done(null, false)
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password)
                    }

                    let result = await userService.create(newUser)
                    return done(null, result)
                } catch (error) {
                    //return done("Error al registrar usuario: " + error.message)
                    return req.res.status(500).send({ code: 500, status: "error", message: "Error al registrar usuario" });
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id)
        done(null, user)
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userService.findOne({ email: username });

            if (!user) {
                console.log("El usuario no existe")
                //return res.status(400).send({ status: "error", error: "Usuario no encontrado" });
                return done(null, false)
            }

            if (!isValidPassword(user, password)) {
                //return res.status(403).send({ status: "error", error: "Password incorrecto" });
                return done(null, false)
            }
            
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport