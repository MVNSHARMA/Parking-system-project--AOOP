export interface Vehicle {
  id: string;
  plateNumber: string;
  ownerName: string;
  vehicleType: VehicleType;
  entryTime: Date;
  exitTime?: Date;
  slotId?: string;
  paymentAmount?: number;
  paymentMode?: 'cash' | 'card' | 'upi' | 'pending';
}

export enum VehicleType {
  CAR = 'CAR',
  BIKE = 'BIKE',
  TRUCK = 'TRUCK'
}

export interface ParkingSlot {
  id: string;
  number: number;
  type: VehicleType;
  isOccupied: boolean;
  floor: number;
}

export interface ParkingRate {
  vehicleType: VehicleType;
  baseRate: number;
  hourlyRate: number;
}