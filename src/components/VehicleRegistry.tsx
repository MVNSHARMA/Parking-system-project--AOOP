import React from 'react';
import { motion } from 'framer-motion';
import { Car, Bike, Truck, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { Vehicle, VehicleType } from '../types';
import { fadeInUp, staggerContainer } from '../utils/animations';

interface VehicleRegistryProps {
  vehicles: Vehicle[];
}

const VehicleRegistry: React.FC<VehicleRegistryProps> = ({ vehicles }) => {
  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case VehicleType.CAR:
        return <Car className="text-blue-600" size={20} />;
      case VehicleType.BIKE:
        return <Bike className="text-green-600" size={20} />;
      case VehicleType.TRUCK:
        return <Truck className="text-purple-600" size={20} />;
      default:
        return null;
    }
  };

  const getPaymentModeIcon = (mode?: string) => {
    switch (mode) {
      case 'cash':
        return <Wallet className="text-green-600" size={20} />;
      case 'card':
        return <CreditCard className="text-blue-600" size={20} />;
      case 'upi':
        return <Smartphone className="text-purple-600" size={20} />;
      default:
        return null;
    }
  };

  // Sort vehicles: checked out vehicles first, sorted by exit time, then currently parked vehicles
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (a.exitTime && b.exitTime) {
      return new Date(b.exitTime).getTime() - new Date(a.exitTime).getTime();
    }
    if (a.exitTime) return -1;
    if (b.exitTime) return 1;
    return new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime();
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="mt-8 bg-white rounded-2xl shadow-lg p-6"
    >
      <motion.h2
        variants={fadeInUp}
        className="text-2xl font-bold mb-6 text-gray-800"
      >
        Vehicle Registry
      </motion.h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedVehicles.map((vehicle, index) => (
              <motion.tr
                key={vehicle.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className={`hover:bg-gray-50 ${vehicle.exitTime ? 'bg-gray-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getVehicleIcon(vehicle.vehicleType)}
                    <span className="ml-2 text-sm font-medium text-gray-900">{vehicle.plateNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vehicle.ownerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(vehicle.entryTime).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vehicle.exitTime ? new Date(vehicle.exitTime).toLocaleString() : 'Still Parked'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vehicle.exitTime 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {vehicle.exitTime ? 'Checked Out' : 'Parked'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vehicle.paymentAmount 
                      ? `₹${vehicle.paymentAmount.toFixed(2)}`
                      : vehicle.exitTime 
                        ? 'Processing'
                        : 'Pending'
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getPaymentModeIcon(vehicle.paymentMode)}
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {vehicle.paymentMode || 'Pending'}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default VehicleRegistry; 