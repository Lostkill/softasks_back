const Board = require('../models/board');
const Task = require('../models/task');

module.exports = {
    async update(req, res){
        try{
            /*
            *    Atualiza uma task dentro do board sem atualizar todo o board,
            *    e as outras tasks
            */
            const { taskId, payload, type } = req.body;

            /*
            *    O que faço primeiro é procurar o board no qual a task está inserida,
            *    o front envia o id do board, dessa forma uso um simples findById
            *    para achar o board da task
            */
            const board = await Board.findById(req.params.id);
            let newtasks = board.tasks;

            /*
            *    Aqui eu procuro pela task utilizando o taskId como parametro
            *    de comparação substituo os dados dentro da task peslo novos dados
            *    passados dentro do payload
            */
            newtasks = newtasks.map((item) => {
                return item._id == taskId ? item = { ...item, ...payload } : item
            });

            /*
            *    Aqui resgato a task atualizada para retorno
            *   e tratamento no front
            */
            let task = null
            newtasks.map((item) => {
                item._id == taskId ? task = item : ''
            });

            const boardAtt = await Board.findByIdAndUpdate(req.params.id, { tasks: newtasks });

            req.io.emit('taskUpdate', task);
            return res.json(boardAtt)
        }catch( err ){
            return res.status('400').send({ message: 'Ops algo saiu errado... ', error: err })
        }
    },

    async delete(req, res){
        try{
            const { taskId } = req.query;
            
            /*
            * Aqui na função de delete, assim como na de update
            * preciso acessar o board no qual se encontra a task
            * e removela de dentro do campo tasks dentro do board
            */
            const board = await Board.findById(req.params.id);
            const tasks = await Task.findByIdAndDelete(taskId)
            
            let newtasks = board.tasks;

            /*
            * Da mesma forma eu retorno para o front
            * a task que foi excluida 
            */
            let task = null
            newtasks.map((item) => {
                item._id == taskId ? task = item : ''
            });
            
            newtasks = newtasks.filter((item) => item._id != taskId);
            board.tasks = newtasks;
            await board.save();

            req.io.emit('taskRemoved', task);
            return res.send(board)
        }catch( err ){
            return res.status('400').send({ message: 'Ops algo saiu errado... ', error: err })
        }
    }
}