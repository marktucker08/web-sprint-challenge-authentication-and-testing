const db = require('../../data/dbConfig');

function find() {
  
  return db('users')

}

function findBy(filter) {
 
    return db('users')
    .where(filter)
    .orderBy('user_id');
}

function findById(user_id) {
  
    return db('users')
        .where('user_id', user_id).first()
    
}

async function add({ username, password }) {
  const [id] = await db('users').insert({ username, password})
  return findById(id)
}

module.exports = {
  add,
  find,
  findBy,
  findById,
};