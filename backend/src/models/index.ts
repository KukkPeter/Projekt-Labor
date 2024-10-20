import { Dialect, Sequelize } from 'sequelize';
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,                      // Adatbázis neve
    process.env.DATABASE_USER,                      // Felhasználó név
    process.env.DATABASE_PASSWORD,                  // Jelszó az adatbázishoz
    {
        host: process.env.DATABASE_HOST,            // Adatbázis elérési útja
        dialect: process.env.DATABASE_DIALECT as Dialect,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  users: require('./users.model')(sequelize, Sequelize),
  trees: require('./trees.model')(sequelize, Sequelize),
  people: require('./people.model')(sequelize, Sequelize),
  relationships: require('./relationship.model')(sequelize, Sequelize),
  addresses: require('./addresses.model')(sequelize, Sequelize)
}

// Users can have multiple trees
db.users.hasMany(db.trees, {
  foreignKey: 'ownerId'
});
db.trees.belongsTo(db.users, {
  foreignKey: 'ownerId'
});

// People belongs to a tree
db.trees.hasMany(db.people, {
  foreignKey: 'treeId'
});
db.people.belongsTo(db.trees);

// Two peoples can have a relationship
db.people.belongsToMany(db.people, {
  through: db.relationships,
  as: 'personOne',
  foreignKey: 'person1Id'
});
db.people.belongsToMany(db.people, {
  through: db.relationships,
  as: 'personTwo',
  foreignKey: 'person2Id'
});
db.relationships.belongsTo(db.people, {
  as: 'personOne',
  foreignKey: 'person1Id'
});
db.relationships.belongsTo(db.people, {
  as: 'personTwo',
  foreignKey: 'person2Id'
});

// One person can have multiple addresses
db.people.hasMany(db.addresses, {
  foreignKey: 'personId'
});
db.addresses.belongsTo(db.people, {
  foreignKey: 'personId'
});

export = db;