export interface workingHours{
    start:string,
    end:String
}

export interface Court {
courtName:string,
_id:string,
address:string,
location:string,
ownedBy:string,
pricePerHour:string,
sportsAvailable:string[],
workingHours:workingHours
}