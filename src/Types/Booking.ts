interface court{
    _id:string,
    courtName:string,
}

interface payment {
    Paymentstatus:string,
    discount:number,
    remainingAmount:number,
    totalAmount:number,
}

interface user {
    name:string,
    email:string,
    _id:string
}

export interface Booking{
    IsApproved: boolean,
    bookingDate:Date,
    endTime:string,
    isCanceled:boolean,
    startTime:string,
    user:user,
    payment:payment,
    court:court,
    _id:string
}