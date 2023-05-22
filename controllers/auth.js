const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastname: user.lastname,
      location: user.location,
      name: user.name,
      token,
    }
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastname: user.lastname,
      location: user.location,
      name: user.name,
      token,
    }
  })
}

const updateUser = async (req, res) => {
  const { email, password, name, lastname, location } = req.body

  

  if (email === '' || password === '' || name === '' || lastname === '' || location === '') {
    throw new BadRequestError('All fields cannot be empty')
  }
  const user = await User.findByIdAndUpdate({ _id: req.user.userId })
  user.email = email
  user.name = name
  user.lastname = lastname
  user.location = location

  await user.save()
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
     user: {
      email: user.email,
      lastname: user.lastname,
      location: user.location,
      name: user.name,
      token,
    }
  })
}

module.exports = {
  register,
  login,
  updateUser,
}
