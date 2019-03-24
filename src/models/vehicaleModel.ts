import { vehiclesIcons } from "../providers/Enums/vehiclesIcons";
import { reservationEnum } from "../providers/Enums/reservationEnum";

export interface vehicaleModel {
    id: string,
    name: string,
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
}