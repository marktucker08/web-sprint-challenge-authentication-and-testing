const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
// Write your tests here

beforeAll(async ()=> {
  await db.migrate.rollback()
  await db.migrate.latest()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('/api/auth/register', () => {
  const user = { 
    username: 'test',
    password: 'testing',
  }
  test('adds user to database', async ()=> {
    await request(server).post('/api/auth/register').send(user)
      expect(await db('users')).toHaveLength(1)
      // expect(res.body.username).toBe('test')
  })
  test('responds with username taken if exists', async ()=> {
    const res = await request(server).post('/api/auth/register').send(user)
    expect(res.body.message).toBe('username taken')
  })
})

describe('/api/auth/login', ()=> {
  const user3 = { 
    username: 'test3',
    password: 'testing',
  }
  test('responds with welcome message', async () => {
    await request(server).post('/api/auth/register').send(user3)
    const login = await request(server).post('/api/auth/login').send(user3)
    expect(login.body.message).toBe(`welcome, ${user3.username}`)
  })
  test('responds 200 OK', async () => {
    const login = await request(server).post('/api/auth/login').send(user3)
    expect(login.status).toBe(200)
  })
})

describe('/api/jokes', ()=> {
  const user2 = { 
    username: 'test2',
    password: 'testing',
  }
  test('200 OK', async ()=> {
    await request(server).post('/api/auth/register').send(user2)
    const login = await request(server).post('/api/auth/login').send(user2)
    const res = await request(server).get('/api/jokes').send({Authorization: login.body.token})
    expect(res.status).toBe(200)
  })
  test('responds with all jokes', async ()=> {
    const login = await request(server).post('/api/auth/login').send(user2)
    const res = await request(server).get('/api/jokes').send({Authorization: login.body.token})
    expect(res.body).toHaveLength(3)
  })
})
