const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/bookcase_db', { logging: false });


const Book = conn.define('book', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  title: { 
    type: STRING(35)
  }
});

const Member = conn.define('member', {
  name: {
    type: STRING(20)
  }
});

Book.belongsTo(Member, {as: 'owner'});
Member.hasMany(Book, { foreignKey: 'ownerId'});

Book.belongsTo(Book, {as: 'series'});
Member.belongsTo(Member, {as: 'borrowedfrom'})
Member.hasMany(Member, { foreignKey: 'borrowedfromId' });


const syncAndSeed = async() => {
  await conn.sync({ force: true });
  const [ harrypotter1, harrypotter2, verity, brainonfire, gonegirl, evee, beth, sarah ] = await Promise.all([
    Book.create({ title: 'Harry Potter 1' }),
    Book.create({ title: 'Harry Potter 2' }),
    Book.create({ title: 'Verity' }),
    Book.create({ title: 'Brain on Fire' }),
    Book.create({ title: 'Gone Girl' }),
    Member.create({ name: 'Evee' }),
    Member.create({ name: 'Beth' }),
    Member.create({ name: 'Sarah' })
  ]);

  harrypotter1.ownerId = sarah.id;
  harrypotter2.ownerId = beth.id;
  brainonfire.ownerId = evee.id;
  verity.ownerId = beth.id;
  gonegirl.ownerId = evee.id;

  harrypotter1.seriesId = harrypotter2.id,
  harrypotter2.seriesId = harrypotter1.id,

  beth.borrowedfromId = sarah.id,
  evee.borrowedfromId = beth.id,
  evee.borrowedfromId = sarah.id,

  await Promise.all([
    harrypotter1.save(),
    gonegirl.save(),
    brainonfire.save(),
    harrypotter2.save(),
    verity.save(),
    harrypotter1.save(),
    beth.save(),
    evee.save(),
  ])
}

module.exports = {
  conn,
  syncAndSeed,
  models: {
    Book,
    Member
  }
}