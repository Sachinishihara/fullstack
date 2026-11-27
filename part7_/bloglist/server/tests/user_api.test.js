const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.init()
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret123', 10)

  const user = new User({
    username: 'root',
    name: 'Root User',
    passwordHash
  })

  await user.save()
})

// 4.15
test('a new user can be created', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'anna',
    name: 'Anna',
    password: 'password123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length + 1
  )
})

// 4.16
test('duplicate username is rejected', async () => {
  const usersAtStart = await helper.usersInDb()

  const result = await api
    .post('/api/users')
    .send({
      username: 'root',
      password: 'password123'
    })
    .expect(400)

  assert(result.body.error.includes('unique'))

  const usersAtEnd = await helper.usersInDb()

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length
  )
})

test('short username is rejected', async () => {
  const result = await api
    .post('/api/users')
    .send({
      username: 'ab',
      password: 'password123'
    })
    .expect(400)

  assert(result.body.error.includes('username'))

  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

test('short password is rejected', async () => {
  const result = await api
    .post('/api/users')
    .send({
      username: 'anna',
      password: 'ab'
    })
    .expect(400)

  assert(result.body.error.includes('password'))

  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

test('missing username is rejected', async () => {
  const result = await api
    .post('/api/users')
    .send({
      password: 'password123'
    })
    .expect(400)

  assert(result.body.error.includes('username'))

  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

test('missing password is rejected', async () => {
  const result = await api
    .post('/api/users')
    .send({
      username: 'anna'
    })
    .expect(400)

  assert(result.body.error.includes('password'))

  const users = await helper.usersInDb()
  assert.strictEqual(users.length, 1)
})

after(async () => {
  await mongoose.connection.close()
})