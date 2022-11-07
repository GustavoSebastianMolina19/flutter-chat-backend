const { response } = require("express");
const bcryp = require('bcryptjs');

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) =>{

    const{email, password} = req.body;

    try {
        
        const existeEmail = await Usuario.findOne({email: email});

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo ya regostrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcryp.genSaltSync();
        usuario.password = bcryp.hashSync(password, salt);

        await usuario.save();
        
        // GENERAR JWT
        const token = await generarJWT(usuario.id); 


        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }

    

};
const login = async(req, res = response) => {
    const {email, password} = req.body;
    try {
        const usuarioDB = await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar el password
        const validPassword = bcryp.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }


        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );
        
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:'lhable con el admin'
        });
    }
    
}

const renewToken = async (req, res=response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);
    res.json({
        ok: true,
        usuario,
        token
    });
}
module.exports = {
    crearUsuario,
    login,
    renewToken
}