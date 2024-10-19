import { Security, Route, Get, Post, Delete, Body, Controller, Tags, Path } from 'tsoa';
import { IResponse } from "../interfaces/IResponse.interface";

import PeopleService from '../services/people.service';
import {CreateNewPerson} from "../interfaces/createNewPerson.interface";

@Route('/people')
@Tags('People')
export class PeopleController extends Controller {
    @Get('/{treeId}')
    @Security('jwt')
    public async getPeople(@Path() treeId: number): Promise<IResponse> {
        const people = await PeopleService.getPeople(treeId);

        return {
            status: 200,
            message: `Successful query for your people of tree with ID: ${treeId}`,
            data: people
        };
    }

    @Get('/details/{personId}')
    @Security('jwt')
    public async getPerson(@Path() personId: number): Promise<IResponse> {
        const person = await PeopleService.getPerson(personId);

        return {
            status: 200,
            message: `Successful query for person!`,
            data: person
        };
    }

    @Post('/create')
    @Security('jwt')
    public async createNewPerson(@Body() body: CreateNewPerson): Promise<IResponse> {
        const person = await PeopleService.createPerson(body);

        return {
            status: 200,
            message: `Successfully created new person!`,
            data: person
        };
    }

    @Delete('/{personId}')
    @Security('jwt')
    public async deletePerson(@Path() personId: number): Promise<IResponse> {
        const personStatus = await PeopleService.deletePerson(personId);

        return {
            status: 200,
            message: 'Successfully deleted the person!',
            data: personStatus
        }
    }
}