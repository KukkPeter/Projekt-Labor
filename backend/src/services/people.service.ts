import { FieldErrors, ValidateError } from "tsoa";
import { CreateNewPerson } from "../interfaces/createNewPerson.interface";

const db = require('../models').people;
const db_addresses = require('../models').addresses;
const db_relationships = require('../models').relationships;

class PeopleService {
    constructor() {}

    async getPeople(treeId: number): Promise<any> {
        try {
            return await db.findAll({
                where: {
                    treeId: treeId
                },
                include: [
                    {
                        model: db_addresses,
                        as: 'addresses'
                    },
                    {
                        model: db,
                        as: 'personOne',
                        through: {
                            model: db_relationships,
                            attributes: ['type']
                        }
                    },
                    {
                        model: db,
                        as: 'personTwo',
                        through: {
                            model: db_relationships,
                            attributes: ['type']
                        }
                    }
                ]
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "PeopleService:getPeople");
        }
    }

    async getPerson(personId: number): Promise<any> {
        try {
            return await db.findOne({
                where: {
                    id: personId
                },
                include: [
                    {
                        model: db_addresses,
                        as: 'addresses'
                    },
                    {
                        model: db,
                        as: 'personOne',
                        through: {
                            model: db_relationships,
                            attributes: ['type']
                        }
                    },
                    {
                        model: db,
                        as: 'personTwo',
                        through: {
                            model: db_relationships,
                            attributes: ['type']
                        }
                    }
                ]
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "PeopleService:getPerson");
        }
    }

    async createPerson(body: CreateNewPerson): Promise<any> {
        try {
            return await db.create({
                firstName: body.firstName,
                lastName: body.lastName,
                nickName: body.nickName,
                title: body.title,
                gender: body.gender,
                birthDate: body.birthDate,
                deathDate: body.deathDate,
                description: body.description,
                treeId: body.treeId
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "PeopleService:createPerson");
        }
    }

    async deletePerson(personId: number): Promise<any> {
        try {
            const person = await db.findOne({
                where: {
                    id: personId
                }
            });

            if(person !== null) {
                return await person.destroy();
            } else {
                throw new Error('Cannot find person with this ID!');
            }
        } catch(err) {
            throw  new ValidateError(err as FieldErrors, "PeopleService:deletePerson");
        }
    }
}

export default new PeopleService();