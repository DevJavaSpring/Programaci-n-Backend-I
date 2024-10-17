import {Router} from 'express';

const cookieRouter = Router();

/**
 * ENDPONINT DE COOKIE
 */
cookieRouter.get('/setCookie', (req, res) => {
    res.cookie('CookieN1', 'value of cookie nº 1', { maxAge: 1000000 });
    res.cookie('CookieN2', 'value of cookie nº 2', { maxAge: 1000000 });
    res.cookie('CookieN3', 'value of cookie nº 3', { maxAge: 1000000 }).send('Cookie')
});

cookieRouter.get('/getCookie', (req, res) => {
    res.send(req.cookies)
});

cookieRouter.get('/deleteCookie', (req, res) => {
    res.clearCookie('CookieN1').send("Cookie eliminada")
});

export default cookieRouter;