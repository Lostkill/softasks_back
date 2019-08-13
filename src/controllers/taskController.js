const Board = require('../models/board');
const Task = require('../models/task');

module.exports = {
    async update(req, res){
        try{
            const { taskId, payload, type } = req.body;

            const board = await Board.findById(req.params.id);
            let newtasks = board.tasks;

            newtasks = newtasks.map((item) => {
                return item._id == taskId ? item = { ...item, ...payload } : item
            });

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
            
            const board = await Board.findById(req.params.id);
            const tasks = await Task.findByIdAndDelete(taskId)
            
            let newtasks = board.tasks;

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