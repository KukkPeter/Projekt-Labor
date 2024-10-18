import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    "projekt_labor",             // Adatbázis neve
    "root",                     // Felhasználó név
    "",                         // Jelszó az adatbázishoz
    {
        host: "localhost",      // Adatbázis elérési útja
        dialect: "mysql",
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
    users: require('./users.model')(sequelize, Sequelize)
}

export = db;