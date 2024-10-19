import { FieldErrors, ValidateError } from "tsoa";
import {CreateNewTree} from "../interfaces/createNewTree.interface";

const db = require('../models').trees;

class TreesService {
    constructor() {}

    async getTrees(userId: number): Promise<any> {
        try {
            return await db.findAll({
                where: {
                    ownerId: userId
                }
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "TreesService:getTrees");
        }
    }

    async getTree(userId: number, treeId: number): Promise<any> {
        try {
            return await db.findOne({
                where: {
                    id: treeId,
                    ownerId: userId
                }
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "TreesService:getTree");
        }
    }

    async createTree(userId: number, body: CreateNewTree): Promise<any> {
        try {
            const tree = await db.findOne({
                where: {
                    ownerId: userId,
                    title: body.title
                }
            });

            if(tree === null) {
                return await db.create({
                    title: body.title,
                    ownerId: userId
                });
            } else {
                throw new Error('A tree with this title already exists!');
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "TreesService:createTree");
        }
    }

    async deleteTree(userId: number, treeId: number): Promise<any> {
        try {
            const tree = await db.findOne({
                where: {
                    id: treeId,
                    ownerId: userId
                }
            });

            if(tree !== null) {
                return await tree.destroy();
            } else {
                throw new Error('Cannot find tree with this ID!');
            }
        } catch(err) {
            throw  new ValidateError(err as FieldErrors, "TreesService:deleteTree");
        }
    }
}

export default new TreesService();