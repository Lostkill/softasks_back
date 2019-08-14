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

            /*
            *   Para que um usuario não tenha acesso
            *   aos boards de outro usuario, o que faço é
            *   verificar se o campo creator do board é igual 
            *   ao parametro creator que é enviado pela requisição
            */
            allBoards.map(board => {
                board.creator === creator ? myBoard.push(board) : ''
            });

            /*
            *   Assim que encontro os boards daquele usuario
            *   Eu retorno uma estrutura especifica para o front
            *   Dividindo as tasks de cada board em pedente, andamento e finalizada 
            */
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

            //Seto os dados que vão ser inseridos no board
            const board = await Board.create({
                title,
                description,
                status,
                creator
            });

            //Se no momento da inserção do board no banco
            //Já houver task ele já salva a task na collection task e dentro do board
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

            /*
            *    As tasks precisão estar dentro dos boards, então pensando dessa forma
            *    o insert das tasks ocorre no update do board, dessa forma atualizando o campo
            *    tasks dentro do board com as novas tasks, além de inserir a nova task na collection tasks
            */
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
                /*
                *   Caso o type não seja tasks, significa que não estou tentando atualizar
                *   uma task dentro de um board, e sim algum campo do proprio board
                */
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
            //Procura pelo id do board e o remove
            await Board.findByIdAndDelete(req.params.id);
            return res.send('Task deletada com successo');
        }catch( err ){
            return res.status('500').send({ message: 'Ocorreu um erro no servidor... ', erro: err });
        }
    }
}