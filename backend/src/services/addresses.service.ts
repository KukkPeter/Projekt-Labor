import { FieldErrors, ValidateError } from "tsoa";
import { CreateNewAddress } from "../interfaces/createNewAddress.interface";

const db = require('../models').addresses;

class AddressesService {
    constructor() {}

    async getAddresses(personId: number): Promise<any> {
        try {
            return await db.findAll({
                where: {
                    personId: personId
                }
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "AddressesService:getAddresses");
        }
    }

    async getAddress(addressId: number): Promise<any> {
        try {
            return await db.findOne({
                where: {
                    id: addressId
                }
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "AddressesService:getAddress");
        }
    }

    async createAddress(personId: string, body: CreateNewAddress): Promise<any> {
        try {
            return await db.create({
                personId: personId,
                addressType: body.addressType,
                country: body.country,
                postalCode: body.postalCode,
                city: body.city,
                street: body.street,
                door: body.door
            });
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "PeopleService:createPerson");
        }
    }

    async deleteAddress(addressId: number): Promise<any> {
        try {
            const address = await db.findOne({
                where: {
                    id: addressId
                }
            });

            if(address !== null) {
                return await address.destroy();
            } else {
                throw new Error('Cannot find address with this ID!');
            }
        } catch(err) {
            throw  new ValidateError(err as FieldErrors, "AddressesService:deleteAddress");
        }
    }
}

export default new AddressesService();