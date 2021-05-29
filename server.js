const { conn, syncAndSeed, models: { Book, Member }} = require('./db')
// const Sequelize = require('sequelize');
// const { STRING, UUID, UUIDV4 } = Sequelize;
// const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/bookcase_db');
const express = require('express');
const app = express();

app.get('/api/books', async(req, res, next) => {
  try{
    res.send( await Book.findAll({
      include: [ 
        {
          model: Member,
          as: 'owner'
        }
       ]
    }));
  }
  catch(ex) {
    next(ex);
  }
})

app.get('/api/members', async(req, res, next) => {
  try{
    res.send( await Member.findAll({
      include: [
        {
          model: Member,
          as: 'borrowedfrom'
        },
        Member, Book
      ]
    }));
  }
  catch(ex) {
    next(ex);
  }
})

const init = async() => {
  try{
    await conn.authenticate();
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, () => `Listening on port ${port}`)
  }
  catch(err){
    console.log(err);
  }
}

init();