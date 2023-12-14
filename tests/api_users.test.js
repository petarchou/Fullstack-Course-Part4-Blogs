const mongoose = require('mongoose')
const app = require('../app.js')
const User  = require('../models/user.js')
const helper = require('./test_helper.js')
const supertest = require('supertest')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    console.log('User Database cleared')
}) 

describe('When creating users', () => {
    test('Invalid input doesnt create user and returns 400 with proper message', async () => {
        const usersBefore = await helper.usersInDb()
        const userInput = {
            username: 'user001',
            name: 'mr001',
            password: '00'
        }

        const response = await api.post('/api/users')
        .send(userInput)
        .set('Content-Type', 'application/json')
        
        expect(response.statusCode).toEqual(400)
        expect(response.body.error).toEqual("'username' and 'password' should be atleast 3 characters long")

        const usersAfter = await helper.usersInDb()
        expect(usersBefore).toEqual(usersAfter)
    })
})