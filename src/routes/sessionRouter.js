import {Router} from 'express';
import UserController from '../controllers/userController.js';
import passport from 'passport';

const router = Router();
const userController = new UserController();

const isAdmin = (req, res, next) => {

    if (req.user.role == 'admin') return next();

    res.status(403).send({
        status: 'error',
        message: 'no autorizado'
    });
    
}

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

router.post('/register', async (req, res) => {
    try {
        const result = await userController.createUser(req.body);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

router.get('/failRegister', async(req, res) => {
    console.log('Error de Estrategia');
    res.status(401).send({error:"Error de Estrategia"});
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const token = await userController.loginUser({email, password});
        
        res.cookie('auth', token, { maxAge: 60*60*1000 }).send({
            status: 'success',
            token
        });


    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: 'Error al loguear usuario: ' + error.message
        });
    }
});

router.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
    res.send({
        user: req.user
    })  
});

router.get('/:uid', passport.authenticate('jwt', {session: false}), isAdmin ,async (req, res) => {
    try {
        const result = await userController.getUserByID(req.params.uid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
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