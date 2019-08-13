const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
    async register(req, res){
        try{
            const { email, username, name, password } = req.body;

            if(await User.findOne({ email }) || await User.findOne({ username }))
                return res.status(400).json({ error: 'Usario já existente' })                        

            const user = await User.create({
                email,
                username,
                name,
                password
            });
            
            return res.json(user)
        }catch( err ){
            return res.send(err);
        }
    },

    async auth(req, res){
        try{
            const { email, username, password } = req.body;
            const userParam = email ? { email } : { username };

            const user = await User.findOne(userParam).select('+password');

            if(!user)
                return res.send('Usuario não encontrado');
            
            if(!await bcrypt.compare(password, user.password))
                return res.send('Senha invalida');
            
            user.password = undefined;

            let response = {
                user,
                resultado: true
            }
        
            return res.json(response);
        }catch(err){
            return res.send(err);
        }
    }
}