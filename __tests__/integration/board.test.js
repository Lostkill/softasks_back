const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../src/index');

const User = mongoose.model('User');

it.only('Se é possivel criar um board ', async () => {
    const response = await chai.request(app)
        .post('/').send({ 
            title: 'Board Teste',
            description: 'A board from tests',
            status: 'pendente',
            creator: '5d535c4616dbad03506a711b',
            tasks: []
         });

    expect(response.body).to.have.property('_id');
    
}).timeout(3000);

it('Todos os boards retornados', async () => {
    const response = await chai.request(app)
        .get('/?creator=5d535c4616dbad03506a711b');
    expect(response.body).to.have.an('array');
}).timeout(2000);