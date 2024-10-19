import { FieldErrors, ValidateError } from "tsoa";
import { Op } from "sequelize";

import { CreateNewRelationship } from "../interfaces/createNewRelationship.interface";

const db = require('../models').relationships;

class RelationshipsService {
    constructor() {}

    async getRelationships(personId: number): Promise<any> {
        try {
            return await db.findAll({
                where: {
                    [Op.or]: [
                        {
                            person1Id: personId,
                        },
                        {
                            person2Id: personId
                        }
                    ]
                }
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "RelationshipsService:getRelationships");
        }
    }

    async addRelationship(body: CreateNewRelationship): Promise<any> {
        try {
            return await db.create({
                person1Id: body.person1Id,
                person2Id: body.person2Id,
                type: body.type
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "RelationshipsService:addRelationship");
        }
    }
}

export default new RelationshipsService();