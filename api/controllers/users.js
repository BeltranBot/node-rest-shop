const User = require('../models/user')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

exports.signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(users => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: 'Email already registered'
        })
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) return res.status(500).json({ error: err })
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          })
          User.save()
            .then(result => {
              console.log(result)
              res.status(201).json({
                message: 'User Created'
              })
            })
            .catch(err => {
              console.log(err)
              res.status(500).json({ error: err })
            })
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.get_all = (req, res, next) => {
  User.find()
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json({
        count: result.length,
        users: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          })
        }
        if (result) {
          const token = jwt.sign({
            email: users[0].email,
            userId: users[0]._id,
          },
            process.env.JWT_KEY,
            {
              expiresIn: '1h'
            }
          )
          return res.status(200).json({
            message: 'Auth successful',
            token
          })
        }
        return res.status(200).json({
          message: 'Auth failed'
        })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        errors: err
      })
    })
}

exports.get = (req, res, next) => {
  const id = req.params.userId
  User.findById(id)
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.delete = (req, res, next) => {
  const id = req.params.userId
  User.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/users',
          body: { email: 'String', password: 'String' }
        }
      })
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}