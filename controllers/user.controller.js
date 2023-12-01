//require user model
const User = require('../models/userModel.js')

//create a user document
exports.create = async (req, res) => {
    //destructure properties of req.body
    const { username, password } = req.body
    //make new user document
    let newUser = new User({
        username: username,
        password: password
    })

    //save user model to database with save method
    try {
        const savedUser = await newUser.save();
        console.log(savedUser)
        res.status(200).send({message: 'User added successfully'})
    } catch(error) {
        console.error(error);
        res.status(500).send({message: "some error occured while creating the user"})
    }
}

//update todos property of user document


exports.updateTodosByUsername = async (req, res) => {
    //get properties from request body
    const { username, todos }  = req.body
    //findOneAndUpdate method
    try {
        //get result of using findOneAndUpdate mongoose method on db
      const result = await User.findOneAndUpdate(
        { username },
        { username, todos },
        { upsert: true, new: true}
      );
      //handle success / failure
      res.json({ message: `Todos updated for ${username} from controller`})
      console.log(result)
    } catch(error) {
      res.status(500).json({ message: 'Error updating todos from controller'})
    }

}

//function to get users todos
exports.findAllTodos = async (req, res) => {
    //get username from request query
    const { username } = req.query;
    try{
        //use find method on User object 
        const userTodos = await User.findOne({ username: username })
        console.log('found todos')
        res.json(userTodos)
    } catch(error){
        res.status(500).json({message: 'Error retrieving user todos'})
    }
  }