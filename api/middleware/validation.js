const User = require('../users/users-model')

const validateAuthBody = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        next({ message: "username and password required" })
    } else {
        next()
    }
}

const uniqueUser = async (req, res, next) => {
    try {
        const [user] = await User.findBy({ username: req.body.username })
        if (user) {
          next({ status: 401, message: "username taken" })
        }
        else {
          next()
        }
      }
      catch(err) {
        next(err)
        }
}

const usernameExists = async (req, res, next) => {
    try {
        const [user] = await User.findBy({ username: req.body.username })
        if (!user) {
          next({ status: 401, message: "invalid credentials" })
        }
        else {
          req.user = user;
          next()
        }
      }
      catch(err) {
        next(err)
        }
}


module.exports = {
    validateAuthBody,
    uniqueUser,
    usernameExists
};

