export interface workingHours{
    start:string,
    end:string
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