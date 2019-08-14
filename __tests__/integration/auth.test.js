const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../src/index');

const User = mongoose.model('User');

it('Se é possivel LOGAR com crenciais validas ', async () => {
    const username = 'peiblow'
    const user = await User.findOne({ 
        username: 'peiblow',
        password: '123' 
    });

    const response = await chai.request(app)
        .post('/auth').send({ username, password: '123' });

    expect(response.body).to.have.property('resultado');
    
}).timeout(5000);

it('Se é possivel salvar os dados do usuario na DB', async () => {
    const username = 'peiblow56' //Username que não existe
    const name = 'peiblow56' // name que não existe
    const email = 'peiblow56@gmail.com' //email que não existe

    const response = await chai.request(app)
        .post('/register').send({ username, email, name, password: '123' });

    expect(response.body).to.have.property('username');
}).timeout(5000);