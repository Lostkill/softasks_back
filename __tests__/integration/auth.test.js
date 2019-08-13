const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../src/index');

const User = mongoose.model('User');

it('It should be able to signin with valid crendentials', async () => {
    const username = 'peiblow'
    const user = await User.findOne({ 
        username: 'peiblow',
        password: '123' 
    });

    const response = await chai.request(app)
        .post('/auth').send({ username, password: '123' });

    expect(response.body).to.have.property('resultado');
});

it('It should be able to save user data in db', async () => {
    const username = 'pablo'
    const name = 'Pablo Santos'
    const email = 'pablo@gmail.com'

    const user = await User.create({
        email,
        username,
        name,
        password: '123'
    });

    const response = await chai.request(app)
        .post('/auth').send({ username, email, name, password: '123' });

    expect(response.body).to.have.property('user');
});