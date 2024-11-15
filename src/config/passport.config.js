import passport from "passport";
import local from 'passport-local'
import userService from '../services/UserServices.js';
import jwt from 'passport-jwt'
import { createHash, isValidPassword, PRIVATE_KEY_JWT } from '../utils.js'

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['accessToken']
    }
    return token
}



const initializePassport = () => {
    passport.use(
        'register', 
        new LocalStrategy(
            { passReqToCallback: true, usernameField: 'email'}, 
            async (req, username, password, done) => {
                const { first_name, last_name, email, age, role } = req.body;
                
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

                    let user = await userService.buscarUserPorEmail(username);
                    if (user) {
                        console.log("El usuario existe")
                        return done(null, false)
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        role
                    }

                    let result = await userService.agregarUser(newUser);
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
        let user = await userService.buscarUser(id);
        done(null, user)
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userService.buscarUserPorEmail(username);

            if (!user) {
                //return req.res.status(400).send({ status: "error", error: "No existe un usuario con ese email" });
                return done(null, false)
            }

            if (!isValidPassword(user, password)) {
                //return req.res.status(403).send({ status: "error", error: "Password incorrecto" });
                return done(null, false)
            }
            
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
    
    passport.use('current', 
        new JWTStrategy(
            { jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), secretOrKey: PRIVATE_KEY_JWT }, 
            async (jwt_payload, done) => {
                try {
                    const userDTO = await userService.buscarUserDTOPorEmail(jwt_payload.user.email);

                    if (!userDTO) {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    }
                    return done(null, userDTO);  
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
}

export default initializePassport