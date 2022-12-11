const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const {usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controllers/socket')


// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    //console.log(client.handshake.headers['x-token']);

    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token'])
    //console.log(valido, uid)
    // verificar autenticación
    if(!valido) {return client.disconnect();}

    //cliente autenticado 
    usuarioConectado(uid);

    // Ingresar al usuario a una sala en especifico 
    // Sala. global, cliente id, uid

    client.join(uid);
    
    //Escuchar mensaje
    client.on('mensaje-personal', async (payload) => {
       // console.log(payload); TODO: Guardar mensaje
        await grabarMensaje(payload)
        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
        console.log('Cliente desconectado');
    });

    /*client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });*/


});
