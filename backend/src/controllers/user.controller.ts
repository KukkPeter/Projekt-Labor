import { Request, Security, Route, Get, Post, Body, Controller, Tags, Path } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { LoginUser } from '../interfaces/loginUser.interface';
import { RegisterUser } from '../interfaces/registerUser.interface';
import UserService from '../services/user.service';

@Route('/user')
@Tags('User')
export class UserController extends Controller {
    @Post('/login')
    public async loginUser(@Body() body: LoginUser): Promise<IResponse> {
        const token = await UserService.login(body);
        return {
            status: 200,
            message: "Successful login!",
            data: token
        };
    }

    @Post('/register')
    public async registerUser(@Body() body: RegisterUser): Promise<IResponse> {
        const user = await UserService.register(body);

        return {
            status: 200,
            message: "Successful registration! You can log in now.",
            data: user
        }
    }

    @Post('/logout')
    @Security('jwt')
    public async logoutUser(): Promise<IResponse> {
        return {
            status: 200,
            message: "Logout successful!",
            data: 'Logout successful!'
        };
    }

    @Get('/myself')
    @Security('jwt')
    public async getMyself(@Request() request: any): Promise<IResponse> {
        const user = await UserService.getUserFromToken(request.user);

        return {
            status: 200,
            message: "OK",
            data: user
        };
    }

    @Get('/{userId}')
    @Security('jwt')
    public async getUserById(@Path() userId: number): Promise<IResponse> {
        const userById = await UserService.getById(userId);
        return {
            status: 200,
            message: "OK",
            data: userById
        }
    }
}