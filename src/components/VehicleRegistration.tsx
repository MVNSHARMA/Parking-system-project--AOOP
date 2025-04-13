import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Clock, History } from 'lucide-react';
import { VehicleType, Vehicle } from '../types';
import { fadeInUp, scaleIn, buttonHover, buttonTap } from '../utils/animations';
import toast from 'react-hot-toast';
import { ParkingService } from '../services/ParkingService';

interface RegistrationFormData {
  plateNumber: string;
  ownerName: string;
  vehicleType: VehicleType;
}

interface VehicleRegistrationProps {
  onClose: () => void;
  onRegister: (data: RegistrationFormData) => void;
}

const VehicleRegistration: React.FC<VehicleRegistrationProps> = ({ onClose, onRegister }) => {
  const parkingService = ParkingService.getInstance();
  const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm<RegistrationFormData>();
  const [error, setError] = useState<string | null>(null);
  const [foundVehicle, setFoundVehicle] = useState<Vehicle | null>(null);
  const plateNumber = useWatch({ control, name: 'plateNumber' });

  // Watch for plate number changes and auto-fill details
  useEffect(() => {
    if (plateNumber && plateNumber.length >= 6) { // Wait until plate number is partially entered
      const existingVehicle = parkingService.findVehicleByPlateNumber(plateNumber);
      if (existingVehicle) {
        setFoundVehicle(existingVehicle);
        setValue('ownerName', existingVehicle.ownerName);
        setValue('vehicleType', existingVehicle.vehicleType);
        
        const isCurrentlyParked = !existingVehicle.exitTime;
        toast.success(
          <div className="flex items-center gap-2">
            {isCurrentlyParked ? <Car size={20} /> : <History size={20} />}
            <span>
              {isCurrentlyParked 
                ? 'Vehicle currently parked! Details auto-filled.' 
                : 'Previous vehicle found! Details auto-filled.'}
            </span>
          </div>,
          {
            duration: 3000,
          }
        );
      } else {
        setFoundVehicle(null);
      }
    }
  }, [plateNumber, setValue]);

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setError(null);
      await onRegister(data);
      reset();
      toast.success('Vehicle registered successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register vehicle');
      toast.error(err instanceof Error ? err.message : 'Failed to register vehicle');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto mt-6"
      >
        <motion.div
          variants={fadeInUp}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Vehicle Registration</h2>
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {foundVehicle && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              {!foundVehicle.exitTime ? <Car size={20} /> : <History size={20} />}
              <span className="font-semibold">
                {!foundVehicle.exitTime ? 'Currently Parked Vehicle' : 'Previous Vehicle Found'}
              </span>
            </div>
            <div className="text-sm">
              <p>Owner: {foundVehicle.ownerName}</p>
              <p>Type: {foundVehicle.vehicleType}</p>
              {foundVehicle.exitTime && (
                <p className="flex items-center gap-1">
                  <Clock size={14} />
                  Last parked: {new Date(foundVehicle.entryTime).toLocaleString()}
                </p>
              )}
            </div>
          </motion.div>
        )}

        <motion.form
          variants={fadeInUp}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <motion.div
            variants={fadeInUp}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plate Number</label>
              <motion.input
                {...register('plateNumber', { 
                  required: 'Plate number is required',
                  pattern: {
                    value: /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/,
                    message: 'Please enter a valid plate number (e.g., MH12AB1234)'
                  }
                })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.plateNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                placeholder="Enter plate number (e.g., MH12AB1234)"
                whileFocus={{ scale: 1.02 }}
              />
              {errors.plateNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.plateNumber.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
              <motion.input
                {...register('ownerName', { 
                  required: 'Owner name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.ownerName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                placeholder="Enter owner name"
                whileFocus={{ scale: 1.02 }}
              />
              {errors.ownerName && (
                <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <motion.select
                {...register('vehicleType', { required: 'Vehicle type is required' })}
                className={`w-full px-4 py-2 rounded-lg border ${errors.vehicleType ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="">Select vehicle type</option>
                <option value={VehicleType.CAR}>Car</option>
                <option value={VehicleType.BIKE}>Bike</option>
                <option value={VehicleType.TRUCK}>Truck</option>
              </motion.select>
              {errors.vehicleType && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
              )}
            </div>
          </motion.div>

          <motion.button
            variants={fadeInUp}
            whileHover={buttonHover}
            whileTap={buttonTap}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Register Vehicle
          </motion.button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default VehicleRegistration; 