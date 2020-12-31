const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError}= require('apollo-server')

const {validateRegisterInput,validateLoginInput} = require('../../util/validators')
const User = require('../../models/User')
const {SECRET_KEY} = require('../../config')

module.exports = {
  Query:{
    async getUsers() {
      try{
        const users = await User.find();
        // console.log(users)
        return users;
      }
      catch(err){
        throw new Error(err);
      }
    }
  },
  Mutation:{
    async register(_,
      {
        registerInput:{username,email,password,confirmPassword}
      }
      ,context,
      info){
      // Validate user data
      const {valid, errors } = validateRegisterInput(username,email,password,confirmPassword)
      if(!valid){
        throw new UserInputError('Errors',{errors})
      }
      // Test if user already exist
      const user = await User.findOne({username})
      if(user){
        throw new UserInputError('Name taken')
          errors: {
            username: 'This name is already taken'
          }
      }
      // hash password and create auth token ( pkgs bcryptjs jsonwebtoken)
      password = await bcrypt.hash(password,12)
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
      },SECRET_KEY,{expiresIn:'1h'});

      // console.log(res)
      return{
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
}


// parent: here we dont need the parent so we ca write " _ ",
// so we can still be able to have acess to the args
// args: here that is the 4 fields of registerInput
// context:
// info: some metadata
