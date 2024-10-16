export default interface Customer{
    _id: string;
    phone_number:number;
    email:string;
    name:string;
    profile:string;
}


export interface BECustomerUpdate{
    phone_number?:number;
    email?:string;
    name?:string;
    profile?:string;
}