const Board = require('../models/board');
const Task = require('../models/task');

//CRUD TASKS
module.exports = {
    //Função que resgata os boards de cada usuario
    async index(req, res){
        try{
            const { creator } = req.query;

            const allBoards = await Board.find().sort('-createdAt');
            let myBoard = [];

            allBoards.map(board => {
                board.creator === creator ? myBoard.push(board) : ''
            });            

            myBoard.map((item) => {
                let pendente = [];
                let andamento = [];
                let finalizado = [];

                item.tasks.length > 0 && item.tasks.map((task) => {
                    if(task.status == 'pendente'){
                        pendente.push(task)
                    }else if(task.status == 'andamento'){
                        andamento.push(task)
                    }else if(task.status == 'finalizado'){
                        finalizado.push(task);
                    }
                })
                item.tasks = { pendente, andamento, finalizado };
            })
            return res.json(myBoard);
        }catch( err ){
            return res.status('500').send({ message: 'Ocorreu um erro no servidor... ', erro: err });
        }        
    },

    //Função que cria no banco os boards
    async store(req, res){
        try{
            const { title, description, status, creator, tasks } = req.body;

            const board = await Board.create({
                title,
                description,
                status,
                creator
            });

            if( tasks ){
                await Promise.all( tasks.map( async task => {
                    const taskBoard = new Task({ ...task, board: board._id });
                    
                    await taskBoard.save()
                    board.tasks.push(taskBoard);
                }));

                await board.save();
            }

            req.io.emit('NewBoard', board);
            return res.json(board);
        }catch( err ){
            return res.status('400').send({ message: 'Ops algo saiu errado... ', error: err })
        }
    },

    //Função atualiza um board, e adiciona uma task a um board
    async update(req, res){
        try{
            const { type } = req.body;
            
            const board = await Board.findById(req.params.id);

            if(type == 'tasks'){
                const { tasks } = req.body;
                await Promise.all( tasks.map( async task => {
                    const taskBoard = new Task({ ...task, board: req.params.id });
                    
                    await taskBoard.save()
                    board.tasks.push(taskBoard);
                    req.io.emit('NewTask', taskBoard);
                }));

                await board.save();
            }else{
                board = await Board.findByIdAndUpdate(req.params.id, req.body);
            }
            
            req.io.emit('BoardUpdate', board);
            return res.json(board)
        }catch( err ){
            return res.status('400').send({ message: 'Ops algo saiu errado... ', error: err })
        }
    },

    //Remover Board do banco
    async delete(req, res){
        try{
            await Board.findByIdAndDelete(req.params.id);
            return res.send('Task deletada com successo');
        }catch( err ){
            return res.status('500').send({ message: 'Ocorreu um erro no servidor... ', erro: err });
        }
    }
}