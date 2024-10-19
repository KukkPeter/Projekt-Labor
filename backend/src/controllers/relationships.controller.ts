import { Security, Route, Get, Post, Body, Controller, Tags, Path } from 'tsoa';
import { IResponse } from "../interfaces/IResponse.interface";

import {CreateNewRelationship} from "../interfaces/createNewRelationship.interface";

import RelationshipsService from '../services/relationships.service';

@Route('/relationships')
@Tags('Relationships')
export class RelationshipsController extends Controller {
    @Get('/{personId}')
    @Security('jwt')
    public async getRelationshipsForPerson(@Path() personId: number): Promise<IResponse> {
        const relations = await RelationshipsService.getRelationships(personId);

        return {
            status: 200,
            message: `Successful query for relationships!`,
            data: relations
        };
    }

    @Post('/create')
    @Security('jwt')
    public async createNewAddress(@Body() body: CreateNewRelationship): Promise<IResponse> {
        const relation = await RelationshipsService.addRelationship(body);

        return {
            status: 200,
            message: `Successfully added new relation!`,
            data: relation
        };
    }
}