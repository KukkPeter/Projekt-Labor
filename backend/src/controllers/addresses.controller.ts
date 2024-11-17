import { Security, Route, Get, Post, Delete, Body, Controller, Tags, Path } from 'tsoa';
import { IResponse } from "../interfaces/IResponse.interface";

import { CreateNewAddress } from "../interfaces/createNewAddress.interface";

import AddressesService from '../services/addresses.service';

@Route('/addresses')
@Tags('Addresses')
export class AddressesController extends Controller {
    @Get('/person/{personId}')
    @Security('jwt')
    public async getAddresses(@Path() personId: number): Promise<IResponse> {
        const addresses = await AddressesService.getAddresses(personId);

        return {
            status: 200,
            message: `Successful query for your addresses of person with ID: ${personId}`,
            data: addresses
        };
    }

    @Get('/get/{addressId}')
    @Security('jwt')
    public async getAddress(@Path() addressId: number): Promise<IResponse> {
        const address = await AddressesService.getAddress(addressId);

        return {
            status: 200,
            message: `Successful query for address!`,
            data: address
        };
    }

    @Post('/create/{personId}')
    @Security('jwt')
    public async createNewAddress(@Path() personId: string, @Body() body: CreateNewAddress): Promise<IResponse> {
        const address = await AddressesService.createAddress(personId, body);

        return {
            status: 200,
            message: `Successfully added new address!`,
            data: address
        };
    }

    @Delete('/{addressId}')
    @Security('jwt')
    public async deleteAddress(@Path() addressId: number): Promise<IResponse> {
        const addressStatus = await AddressesService.deleteAddress(addressId);

        return {
            status: 200,
            message: 'Successfully deleted the address!',
            data: addressStatus
        }
    }
}