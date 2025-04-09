import React, { useState, useEffect } from 'react';
import { Car, List } from 'lucide-react';
import { motion } from 'framer-motion';
import { Vehicle, VehicleType, ParkingSlot } from './types';
import VehicleRegistration from './components/VehicleRegistration';
import ParkingSlots from './components/ParkingSlots';
import ParkedVehicles from './components/ParkedVehicles';
import VehicleRegistry from './components/VehicleRegistry';
import PaymentModal from './components/PaymentModal';
import { ParkingService } from './services/ParkingService';

function App() {
  const parkingService = ParkingService.getInstance();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [showRegistry, setShowRegistry] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const slots = parkingService.getAllSlots();
      setParkingSlots(slots);
      setVehicles(parkingService.getCurrentlyParkedVehicles());
      setAllVehicles(parkingService.getAllVehicles());
    } catch (error) {
      console.error('Error loading parking slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleRegistration = async (data: { plateNumber: string; ownerName: string; vehicleType: VehicleType }) => {
    setIsLoading(true);
    try {
      const newVehicle = parkingService.registerVehicle(data);
      setSelectedVehicle(newVehicle);
      setVehicles(parkingService.getCurrentlyParkedVehicles());
      setAllVehicles(parkingService.getAllVehicles());
    } catch (error) {
      console.error('Error registering vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = async (slot: ParkingSlot) => {
    if (!selectedVehicle) return;

    setIsLoading(true);
    try {
      const success = parkingService.parkVehicle(selectedVehicle.id, slot.id);
      if (success) {
        setParkingSlots(parkingService.getAllSlots());
        setVehicles(parkingService.getCurrentlyParkedVehicles());
        setAllVehicles(parkingService.getAllVehicles());
        setSelectedVehicle(null);
      }
    } catch (error) {
      console.error('Error parking vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async (vehicle: Vehicle) => {
    setIsLoading(true);
    try {
      const fee = parkingService.checkoutVehicle(vehicle.id);
      setCheckoutAmount(fee);
      setSelectedVehicle(vehicle);
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Error calculating parking fee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = async (paymentMode: 'cash' | 'card' | 'upi') => {
    if (!selectedVehicle) return;

    setIsLoading(true);
    try {
      const vehicle = vehicles.find(v => v.id === selectedVehicle.id);
      if (vehicle) {
        vehicle.paymentMode = paymentMode;
      }
      setVehicles(parkingService.getCurrentlyParkedVehicles());
      setAllVehicles(parkingService.getAllVehicles());
      const slots = parkingService.getAllSlots();
      setParkingSlots(slots);
      setSelectedVehicle(null);
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Error completing payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Parking Management System</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRegistry(!showRegistry)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            <List size={20} />
            {showRegistry ? 'Hide Registry' : 'Show Registry'}
          </motion.button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showRegistry ? (
          <VehicleRegistry vehicles={allVehicles} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <VehicleRegistration
                  onRegister={handleVehicleRegistration}
                  onClose={() => setSelectedVehicle(null)}
                />
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                {selectedVehicle ? (
                  <ParkingSlots
                    slots={parkingSlots}
                    selectedVehicle={selectedVehicle}
                    onSlotSelect={handleSlotSelect}
                    isLoading={isLoading}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center p-8"
                  >
                    <Car className="w-16 h-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                      Register a Vehicle First
                    </h2>
                    <p className="text-gray-500">
                      Please register a vehicle to see available parking slots.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {vehicles.length > 0 && (
              <div className="mt-8">
                <ParkedVehicles
                  vehicles={vehicles}
                  onCheckout={handleCheckout}
                />
              </div>
            )}
          </>
        )}
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={checkoutAmount}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

export default App;