import * as jwt from "jsonwebtoken";
import { FieldErrors, ValidateError } from "tsoa";
import { Crypt } from './crypt.service';
import { LoginUser } from '../interfaces/loginUser.interface';
import { RegisterUser } from '../interfaces/registerUser.interface';

const db = require('../models').users;

class UserService {
    constructor() {}

    async login(body: LoginUser): Promise<any> {
        try {
            const user = await db.findOne({
                where: {
                    email: body.email
                }
            });
            if(user === null) {
                throw new Error('There is no registered user with this email address!');
            } else {
                if(await Crypt.compare(body.password, user.password)) {
                    return this.generateToken(user);
                } else {
                    throw new Error('Wrong password!');
                }
            }
        } catch(err: unknown) {
            throw new ValidateError(err as FieldErrors, "UserService:login");
        }
    }

    async register(body: RegisterUser): Promise<any> {
        try {
            const user = await db.findOne({
                where: {
                    email: body.email
                }
            });

            if(user != null) {
                throw new Error("This email address is already registered!");
            } else {
                if(body.password == body.passwordAgain) {
                    let encryptedPwd = await Crypt.encrypt(body.password);

                    const newUser = await db.create({
                        username: body.username,
                        email: body.email,
                        password: encryptedPwd
                    });

                    return newUser;
                } else {
                    throw new Error("The entered passwords do not match!");
                }
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "UserService:register");
        }
    }

    async getUserFromToken(user: any): Promise<any> {
        try {
            const userFromDB = await db.findByPk(user.id);

            if(userFromDB != null) {
                return {
                    ...userFromDB.dataValues,
                    tokenExperation: user.exp
                };
            } else {
                throw new Error("The logged in user does not exist!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "UserService:getUserFromToken");
        }
    }

    async getById(id: number): Promise<any> {
        try {
            const user = await db.findByPk(id);

            if(user != null) {
                return user;
            } else {
                throw new Error("There is no user with this ID!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "UserService:getById");
        }
    }

    generateToken(user: any): string {
        const payload = {
            id: user.id,
            email: user.email
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES,
        });
    }
}

export default new UserService();