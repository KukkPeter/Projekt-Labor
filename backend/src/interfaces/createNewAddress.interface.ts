export interface CreateNewAddress {
    addressType: 'residence' | 'birth' | 'death';
    country: string;
    postalCode: string;
    city: string;
    street: string;
    door: string;
}