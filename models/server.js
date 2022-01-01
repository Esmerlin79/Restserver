const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const socketIO = require('socket.io');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/socketController');

class Server {

    constructor() {
        this.port   = process.env.PORT || 4000;
        this.app    = express();
        this.server = createServer( this.app );
        this.io     = socketIO( this.server );

        // Database connection
        this.ConnectDB();

        // Endpoints
        this.endpoints = {
            auth:       '/api/auth',
            users:      '/api/users',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            uploads:     '/api/uploads',
        }

        // Middlewares
        this.middlewares();
        
        // Routes
        this.routes();

        // Sockets
        this.sockets();
    }

    async ConnectDB() {
        await dbConnection();
    }

    middlewares() {        
        // CORS 
        this.app.use( cors() );

        // Public directory
        this.app.use( express.static('public') );

        // Parse body
        this.app.use( express.json() );

        // Fileupload
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.endpoints.auth, require('../routes/auth'));
        this.app.use(this.endpoints.users, require('../routes/users'));
        this.app.use(this.endpoints.categories, require('../routes/categories'));
        this.app.use(this.endpoints.products, require('../routes/products'));
        this.app.use(this.endpoints.search, require('../routes/search'));
        this.app.use(this.endpoints.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Running at http://localhost:${this.port}`)
        })
    }
}


module.exports = Server;