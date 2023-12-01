let jwt = require("jsonwebtoken");

//function to checkJWTToken 
function checkJWTToken(req, res, next) {
    //get authorization header from request headers
    const authHeader = req.headers['authorization']
    //if they exist
    if(authHeader) {
        //get token from authheader
        let token = authHeader.split(' ')[1]
        //verify token
        jwt.verify(token, "secretKey", function (error, data) {
            if(error) {
               return next(error)
            } else {
                req.username = data.username;
                req.password = data.password;
                next();
            }
        })
        //else no token
    } else {
        res.send({ message: "No token attached to the request"})
    }
}

//function to check content type
const onlyJSON = (req, res, next) => {
    //use req.is express built-in method, which checks whether the incoming request's content type matches given type
    if(req.is('json')) {
        //pass control to next middleware in stack if it is json
        next();
    } else {
        //send 415 if otherwise
        res.status(415).send('Unsupported media type: Only JSON is accepted')
    }
}



//check if username ends with @gmail.com
const checkUsername = (req, res, next) => {
    //get username from request 
    const { username }  = req.body
    const usernameFromQuery = req.query.username
    //if username doesn't exist or if it doesn't end with @gmail.com
    if(!(username && username.endsWith('@gmail.com')) && !(usernameFromQuery && usernameFromQuery.endsWith('@gmail.com'))){
        return res.status(403).json({error: 'Forbidden - Invalid username'})
    }

    next()
}



//validate task length 
const validateTaskLength = (req, res, next) => {
    //get todos from request body
    const { todos } = req.body;
    //use some method to see if any items length's are bigger than 140
    const hasExceededLimit = todos.some(task => task.title.length > 140);
    //if this evaluates to true send 400 status response
    if(hasExceededLimit) {
        return res.status(400).json({error: "Todo cannot be more than 140 characters"})
    }
    next();
}

module.exports = {
    checkJWTToken,
    checkUsername,
    validateTaskLength,
    onlyJSON
}