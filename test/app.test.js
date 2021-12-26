const request = require('supertest');
const app = require('../app');

describe('Categories Api', () => {

    it('GET /categories --> array categories', async () => {
        return request(app).get('/').expect(200).then( (response) => {
            
        });
    })
    // it('GET /categories/id --> category by id', () => {
    
    // })
    // it('POST /categories --> created category', () => {
    
    // })


})

