/*

    path: api/login

*/
const {Router} = require('express');
const { check } = require('express-validator');

const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post('/new',[
    check('nombre', 'Nombre obligatoria').not().isEmpty(),
    check('password', 'Contraseña obligatoria').not().isEmpty(),
    check('email', 'email incorrecto').isEmail(),
    validarCampos
] ,crearUsuario);

router.post('/',[ 
    check('nombre', 'Nombre obligatoria').not().isEmpty(),
    check('password', 'Contraseña obligatoria').not().isEmpty(),
    ],login);

router.get('/renew', validarJWT,renewToken);

module.exports = router