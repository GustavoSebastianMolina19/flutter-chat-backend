const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        
        mongoose.connect(process.env.DB_CNN, {
        });
        
        console.log('dbConnwcciton')

    } catch (error) {
        console.log(error);
        throw new Error('Error en consola');
    }
}

module.exports = {
    dbConnection
}