import { Vehicle, VehicleType, ParkingSlot } from '../types';

export class ParkingService {
  private static instance: ParkingService;
  private vehicles: Vehicle[] = [];
  private vehicleHistory: Vehicle[] = [];
  private slots: ParkingSlot[] = [];

  private constructor() {
    this.initializeSlots();
  }

  public static getInstance(): ParkingService {
    if (!ParkingService.instance) {
      ParkingService.instance = new ParkingService();
    }
    return ParkingService.instance;
  }

  private initializeSlots(): void {
    let id = 1;
    for (let floor = 1; floor <= 3; floor++) {
      // Cars (10 slots per floor)
      for (let i = 1; i <= 10; i++) {
        this.slots.push({
          id: `${floor}-C-${i}`,
          number: id++,
          type: VehicleType.CAR,
          isOccupied: false,
          floor
        });
      }

      // Bikes (15 slots per floor)
      for (let i = 1; i <= 15; i++) {
        this.slots.push({
          id: `${floor}-B-${i}`,
          number: id++,
          type: VehicleType.BIKE,
          isOccupied: false,
          floor
        });
      }

      // Trucks (5 slots per floor)
      for (let i = 1; i <= 5; i++) {
        this.slots.push({
          id: `${floor}-T-${i}`,
          number: id++,
          type: VehicleType.TRUCK,
          isOccupied: false,
          floor
        });
      }
    }
  }

  private isDuplicateVehicleNumber(plateNumber: string): boolean {
    return this.vehicles.some(vehicle => vehicle.plateNumber.toLowerCase() === plateNumber.toLowerCase());
  }

  public registerVehicle(vehicle: Omit<Vehicle, 'id' | 'entryTime'>): Vehicle {
    if (this.isDuplicateVehicleNumber(vehicle.plateNumber)) {
      throw new Error('A vehicle with this plate number is already registered');
    }

    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      entryTime: new Date()
    };
    this.vehicles.push(newVehicle);
    this.vehicleHistory.push(newVehicle);
    return newVehicle;
  }

  public getAvailableSlots(vehicleType: VehicleType): ParkingSlot[] {
    return this.slots.filter(slot => 
      slot.type === vehicleType && !slot.isOccupied
    );
  }

  public parkVehicle(vehicleId: string, slotId: string): boolean {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    const slot = this.slots.find(s => s.id === slotId);

    if (!vehicle || !slot || slot.isOccupied || slot.type !== vehicle.vehicleType) {
      return false;
    }

    slot.isOccupied = true;
    vehicle.slotId = slotId;
    return true;
  }

  public checkoutVehicle(vehicleId: string): number {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (!vehicle || !vehicle.slotId) return 0;

    const slot = this.slots.find(s => s.id === vehicle.slotId);
    if (!slot) return 0;

    const exitTime = new Date();
    const parkingFee = this.calculateParkingFee(vehicle.entryTime, exitTime, vehicle.vehicleType);

    const historyVehicle = this.vehicleHistory.find(v => v.id === vehicleId);
    if (historyVehicle) {
      historyVehicle.exitTime = exitTime;
      historyVehicle.paymentAmount = parkingFee;
    }

    slot.isOccupied = false;
    
    this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);

    return parkingFee;
  }

  private calculateParkingFee(entryTime: Date, exitTime: Date, vehicleType: VehicleType): number {
    const rates = {
      [VehicleType.CAR]: { baseRate: 50, hourlyRate: 30 },
      [VehicleType.BIKE]: { baseRate: 30, hourlyRate: 20 },
      [VehicleType.TRUCK]: { baseRate: 80, hourlyRate: 50 }
    };

    const hours = Math.ceil(
      (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60)
    );
    
    const rate = rates[vehicleType];
    return rate.baseRate + (Math.max(0, hours - 1) * rate.hourlyRate);
  }

  public getParkedVehicles(): Vehicle[] {
    return this.vehicles.filter(v => v.slotId);
  }

  public getAllSlots(): ParkingSlot[] {
    return this.slots;
  }

  public getAllVehicles(): Vehicle[] {
    return this.vehicleHistory;
  }

  public getCurrentlyParkedVehicles(): Vehicle[] {
    return this.vehicles;
  }

  public findVehicleByPlateNumber(plateNumber: string): Vehicle | undefined {
    // First check in current vehicles
    const currentVehicle = this.vehicles.find(vehicle => 
      vehicle.plateNumber.toLowerCase() === plateNumber.toLowerCase()
    );
    
    if (currentVehicle) {
      return currentVehicle;
    }

    // If not found in current vehicles, check in vehicle history
    // Sort by entry time to get the most recent record
    const historicalVehicles = this.vehicleHistory
      .filter(vehicle => vehicle.plateNumber.toLowerCase() === plateNumber.toLowerCase())
      .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime());

    return historicalVehicles[0]; // Return the most recent record
  }
}