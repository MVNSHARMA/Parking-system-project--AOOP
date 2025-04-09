import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, Truck } from 'lucide-react';
import { ParkingSlot, VehicleType } from '../types';
import { fadeInUp, staggerContainer, buttonHover, buttonTap } from '../utils/animations';

interface ParkingSlotsProps {
  slots: ParkingSlot[];
  selectedVehicle: { vehicleType: VehicleType } | null;
  onSlotSelect: (slot: ParkingSlot) => void;
  isLoading: boolean;
}

const ParkingSlots: React.FC<ParkingSlotsProps> = ({
  slots,
  selectedVehicle,
  onSlotSelect,
  isLoading
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mt-12 p-6 bg-gray-50 rounded-2xl shadow-lg"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-2xl font-bold mb-8 text-gray-800 text-center"
      >
        Select a Parking Slot
      </motion.h2>

      <AnimatePresence>
        {[1, 2, 3].map(floor => (
          <motion.div
            key={floor}
            variants={fadeInUp}
            className="mb-12 bg-white p-6 rounded-2xl shadow-md"
          >
            <motion.h3
              variants={fadeInUp}
              className="text-xl font-semibold mb-6 text-gray-800 text-center"
            >
              Floor {floor}
            </motion.h3>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-5 md:grid-cols-10 gap-4"
            >
              {slots
                .filter(slot => slot.floor === floor)
                .map(slot => (
                  <motion.button
                    key={slot.id}
                    variants={fadeInUp}
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                    onClick={() => onSlotSelect(slot)}
                    disabled={!!(slot.isOccupied || (selectedVehicle && selectedVehicle.vehicleType !== slot.type))}
                    className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all duration-300 min-h-[100px] ${
                      slot.isOccupied
                        ? 'bg-red-100 cursor-not-allowed'
                        : selectedVehicle && selectedVehicle.vehicleType === slot.type
                        ? 'bg-green-100 hover:bg-green-200 shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                      className="mb-2"
                    >
                      {slot.type === VehicleType.CAR && <Car size={32} className="text-blue-600" />}
                      {slot.type === VehicleType.BIKE && <Bike size={32} className="text-green-600" />}
                      {slot.type === VehicleType.TRUCK && <Truck size={32} className="text-purple-600" />}
                    </motion.div>
                    <motion.span
                      className="text-sm font-medium"
                      whileHover={{ scale: 1.1 }}
                    >
                      {slot.number}
                    </motion.span>
                    {slot.isOccupied && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        Occupied
                      </motion.span>
                    )}
                  </motion.button>
                ))}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ParkingSlots; 