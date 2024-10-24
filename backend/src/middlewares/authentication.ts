import { Request } from "express";
import * as jwt from "jsonwebtoken";

export function expressAuthentication(
    request: Request,
    securityName: string
): Promise<boolean | Error> {
    if(securityName === "jwt") {
        let token = request.headers.authorization;

        return new Promise((resolve, reject) => {
            if(!token) {
                reject(new jwt.JsonWebTokenError("Missing token!"));
            } else {
                token = token.split(' ')[1];
                jwt.verify(token, process.env.JWT_SECRET, function(err: any, decoded: any) {
                    if(err) {
                        reject(new jwt.JsonWebTokenError(err));
                    } else {
                        resolve(decoded);
                    }
                });
            }
        });
    } else {
        throw new Error("Something went wrong!");
    }
}