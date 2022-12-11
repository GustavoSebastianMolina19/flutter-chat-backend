const Mensaje = require('../models/mensaje');

const obtenerChat = async(req, res) => {
    const miId = req.uid;
    const mensajeDe = req.params.de;

    const last40 = await Mensaje.find({
        $or: [{de: miId, para: mensajeDe}, {de: mensajeDe, para: miId}]
    })
    .sort({createdAt: 'desc'})
    .limit(40);

    res.json({
        ok: true,
        miId,
        mensajeDe,
        last40
    })

}

module.exports = {
    obtenerChat,
}