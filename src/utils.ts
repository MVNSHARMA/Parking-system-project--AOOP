export const calculateParkingFee = (
  entryTime: Date,
  exitTime: Date,
  vehicleType: 'car' | 'bike' | 'truck'
): number => {
  const rates = {
    car: { baseRate: 50, hourlyRate: 30 },
    bike: { baseRate: 30, hourlyRate: 20 },
    truck: { baseRate: 80, hourlyRate: 50 },
  };

  const hours = Math.ceil(
    (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60)
  );
  
  const rate = rates[vehicleType];
  return rate.baseRate + (Math.max(0, hours - 1) * rate.hourlyRate);
};

export const generateParkingSlots = (): ParkingSlot[] => {
  const slots: ParkingSlot[] = [];
  let id = 1;

  // Generate slots for 3 floors
  for (let floor = 1; floor <= 3; floor++) {
    // Cars (10 slots per floor)
    for (let i = 1; i <= 10; i++) {
      slots.push({
        id: `${floor}-C-${i}`,
        number: id++,
        type: 'car',
        isOccupied: false,
        floor
      });
    }

    // Bikes (15 slots per floor)
    for (let i = 1; i <= 15; i++) {
      slots.push({
        id: `${floor}-B-${i}`,
        number: id++,
        type: 'bike',
        isOccupied: false,
        floor
      });
    }

    // Trucks (5 slots per floor)
    for (let i = 1; i <= 5; i++) {
      slots.push({
        id: `${floor}-T-${i}`,
        number: id++,
        type: 'truck',
        isOccupied: false,
        floor
      });
    }
  }

  return slots;
};