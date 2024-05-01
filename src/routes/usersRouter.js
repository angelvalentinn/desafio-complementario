import {Router} from 'express';
import userModel from '../dao/models/userModel.js';
import passport from 'passport';

const router = Router();

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.post("/register", passport.authenticate('register', {failureRedirect:'/api/sessions/failregister'}) ,async (req, res) => {
    try {
        req.session.failRegister = false;

//        if(req.body.email.trim() == 'adminCoder@coder.com' && req.body.password.trim() == 'adminCod3r123') req.body.admin = true;
        //else req.body.admin = false;

        res.redirect("/login");
    } catch (e) {
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

router.get('/failRegister', async(req, res) => {
    console.log('Error de Estrategia');
    res.status(401).send({error:"Error de Estrategia"});
})

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/failLogin" }) ,async (req, res) => {
    try {
        req.session.failLogin = false;
        
        const result = await userModel.findOne({email: req.body.email});
        req.session.user = result; 

        return res.redirect("/products");
    } catch (e) {
        req.session.failLogin = true;
        return res.redirect("/login");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if(!error) return res.redirect("/login");
        res.send({
            status: "Logout ERROR",
            body: error
        });
    })
});

router.get('/failLogin', (req, res) => {
    res.status(400).send({
        status:'error',
        message:'Failed Login'
    })
})

export default router;