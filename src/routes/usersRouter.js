import {Router} from 'express';

import userModel from '../dao/models/userModel.js';

const router = Router();

router.post("/register", async (req, res) => {
    try {
        req.session.failRegister = false;

        if(req.body.email.trim() == 'adminCoder@coder.com' && req.body.password.trim() == 'adminCod3r123') req.body.admin = true;
        else req.body.admin = false;

        await userModel.create(req.body);
        res.redirect("/login");
    } catch (e) {
        console.log(e.message);
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

router.post("/login", async (req, res) => {
    try {
        req.session.failLogin = false;
        const result = await userModel.findOne({email: req.body.email});
        if (!result) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        if (req.body.password !== result.password) {
            req.session.failLogin = true;
            return res.redirect("/login");
        }

        delete result.password;
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

export default router;