const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const app = require('../../src/index');
const Board = mongoose.model('board');
const Task = mongoose.model('task');


it('É possivel cadastrar novas tasks a um board', async () => {
    const response = await chai.request(app)
        .put('/5d535e431e91c73b9c7c94b7').send({
            type: 'tasks',
            tasks: [{
                title: "Just a Task",
                description: "Just a task to reflex",
                status: "pendente",
                board: "5d535e431e91c73b9c7c94b7"
            }]
        });
    expect(response.body).to.have.property('tasks');
}).timeout(3000);

it('Update uma task', async () => {
    const response = await chai.request(app)
        .put('/task/5d4ed94066e92e24b8233bb3').send({
            taskId:"5d535e431e91c73b9c7c94b7",
            payload: {
                status:"andamento",
                title:"teste1"
            }
        });
    expect(response.body).to.have.property('tasks');
}).timeout(2000);

it('Remover task', async () => {
    const response = await chai.request(app)
        .get('/task/5d4ed94066e92e24b8233bb3' + '?taskId=5d535e431e91c73b9c7c94b7');
    console.log(response.body);
    expect(response.body).to.have.property('tasks');
}).timeout(3000)