var express = require('express');
var router = express.Router();
//get jwt module
let jwt = require("jsonwebtoken")
const { checkJWTToken, validateTaskLength, onlyJSON, checkUsername  } = require('./middleware')

const { updateTodosByUsername, findAllTodos,   } = require('../controllers/user.controller')

const User = require('../models/userModel')


/* GET users listing. */
router.get('/getTodos', checkJWTToken, checkUsername, async (req, res, next) => {

  const { username } = req.query;
    try{
        //use find method on User object 
        const userTodos = await User.findOne({ username: username })
        console.log('found todos')
        res.json(userTodos)
    } catch(error){
        res.status(500).json({message: 'Error retrieving user todos'})
    } 
  
});


//post method to add a new todo to the database
router.put('/addTodo',checkJWTToken,onlyJSON,validateTaskLength, checkUsername, async (req, res, next) => {
    //get info from request bod
    const { username, todos }  = req.body

    try {
      //call findOneAndUpdate method to update user's todo array
      const result = await User.findOneAndUpdate(
        { username },
        { username, todos },
        { upsert: true, new: true}
      );
      res.json({ message: `Todos updated for ${username}`})
      console.log(result)
    } catch(error) {
      res.status(500).json({ message: 'Error updating todos'})
    } 
})
module.exports = router;