const mongoose = require('mongoose');

//schema for user documents
let UserSchema = mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    todos: [
        {
            title: {
                type: String,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            }
        }
    ]
})

module.exports = mongoose.model('User', UserSchema, )