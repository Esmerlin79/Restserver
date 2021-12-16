const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.port = process.env.PORT || 4000;
        this.app  = express();

        // Endpoints
        this.userEndpoint = '/api/auth';

        // Middlewares
        this.middlewares();
        
        // Routes
        this.routes();
    }

    middlewares() {        
        // CORS 
        this.app.use( cors() );

        // Public directory
        this.app.use( express.static('public') );

        // Parse body
        this.app.use( express.json() );
    }

    routes() {
        this.app.use(this.userEndpoint, require('../routes/auth'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Running at http://localhost:${this.port}`)
        })
    }
}


module.exports = Server;