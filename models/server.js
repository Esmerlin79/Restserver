const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.port = process.env.PORT || 4000;
        this.app  = express();

        // Database connection
        this.ConnectDB();

        // Endpoints
        this.endpoints = {
            auth:       '/api/auth',
            users:      '/api/users',
            categories: '/api/categories',
            products:   '/api/products',
        }

        // Middlewares
        this.middlewares();
        
        // Routes
        this.routes();
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
    }

    routes() {
        this.app.use(this.endpoints.auth, require('../routes/auth'));
        this.app.use(this.endpoints.users, require('../routes/users'));
        this.app.use(this.endpoints.categories, require('../routes/categories'));
        this.app.use(this.endpoints.products, require('../routes/products'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Running at http://localhost:${this.port}`)
        })
    }
}


module.exports = Server;