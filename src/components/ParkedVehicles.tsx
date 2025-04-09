import React from 'react';
import { motion } from 'framer-motion';
import { Clock3 } from 'lucide-react';
import { Vehicle } from '../types';

interface ParkedVehiclesProps {
  vehicles: Vehicle[];
  onCheckout: (vehicle: Vehicle) => void;
}

const ParkedVehicles: React.FC<ParkedVehiclesProps> = ({ vehicles, onCheckout }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Parked Vehicles</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-semibold text-gray-800">{vehicle.plateNumber}</p>
                <p className="text-gray-600 mt-1">{vehicle.ownerName}</p>
                <p className="text-gray-500 text-sm mt-2 flex items-center">
                  <Clock3 className="mr-2" size={16} />
                  {new Date(vehicle.entryTime).toLocaleTimeString()}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCheckout(vehicle)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Checkout
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ParkedVehicles; 