import { vehiclesIcons } from "../providers/Enums/vehiclesIcons";
import { reservationEnum } from "../providers/Enums/reservationEnum";

export interface vehicaleModel {
    id: string,
    Name: string,
    avilable: boolean,
    description: string,
    iconImageEnum: vehiclesIcons,
    ImageUrl: string,
    Lat: number,
    Lng: number
}

export class vehicaleReservationModel {
    tripId: null;
    riderId: number;
    vehicleId: string;
    qrStr: string;
    reservationEnum: reservationEnum;
    returnObj: any;
    needPrepare: boolean;
    rateValue: number;
}

export class TripHistory {
    Amount: number;
    Duration: string;
    StartTime: string;
    EndTime: string;
    Name: string;
    IsPaid: boolean;
    IsDone: boolean;
    NetAmount: number;
}