import { Request, Security, Route, Get, Post, Delete, Body, Controller, Tags, Path } from 'tsoa';
import { IResponse } from "../interfaces/IResponse.interface";
import { CreateNewTree } from "../interfaces/createNewTree.interface";

import TreesService from '../services/trees.service';

@Route('/trees')
@Tags('Trees')
export class TreesController extends Controller {
    @Get('/')
    @Security('jwt')
    public async getTrees(@Request() request: any): Promise<IResponse> {
        const trees = await TreesService.getTrees(request.user.id);

        return {
            status: 200,
            message: "Successful query for your trees!",
            data: trees
        };
    }

    @Get('/{treeId}')
    @Security('jwt')
    public async getTreeById(@Request() request: any, @Path() treeId: number): Promise<IResponse> {
        const tree = await TreesService.getTree(request.user.id, treeId);

        return {
            status: 200,
            message: `Successful query for your tree with ID: ${treeId}`,
            data: tree
        };
    }

    @Post('/create')
    @Security('jwt')
    public async createNewTree(@Request() request: any, @Body() body: CreateNewTree): Promise<IResponse> {
        const tree = await TreesService.createTree(request.user.id, body);

        return {
            status: 200,
            message: `Successfully created new tree!`,
            data: tree
        };
    }

    @Delete('/{treeId}')
    @Security('jwt')
    public async deleteTree(@Request() request: any, @Path() treeId: number): Promise<IResponse> {
        const treeStatus = await TreesService.deleteTree(request.user.id, treeId);

        return {
            status: 200,
            message: 'Successfully deleted the tree!',
            data: treeStatus
        }
    }
}