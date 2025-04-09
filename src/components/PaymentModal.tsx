import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Smartphone, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { scaleIn, buttonHover, buttonTap } from '../utils/animations';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: (paymentMode: 'cash' | 'card' | 'upi') => void;
}

interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentComplete,
}) => {
  const [paymentMode, setPaymentMode] = useState<'cash' | 'card' | 'upi'>('cash');
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  if (!isOpen) return null;

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = () => {
    if (paymentMode === 'cash') {
      toast.success('Please pay at the counter');
      onPaymentComplete('cash');
      onClose();
    } else if (paymentMode === 'card') {
      if (!showCardForm) {
        setShowCardForm(true);
        return;
      }
      
      // Validate card details
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error('Please fill in all card details');
        return;
      }
      
      toast.success('Card payment processed successfully');
      onPaymentComplete('card');
      onClose();
    } else if (paymentMode === 'upi') {
      // Redirect to PhonePe
      window.open('https://www.phonepe.com', '_blank');
      toast.success('Redirecting to PhonePe...');
      onPaymentComplete('upi');
      onClose();
    }
  };

  const handleBackToPaymentModes = () => {
    setShowCardForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {showCardForm ? 'Enter Card Details' : 'Complete Payment'}
          </h2>
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </motion.button>
        </div>

        <div className="mb-6">
          <p className="text-3xl font-bold text-gray-900 text-center">
            ₹{amount.toFixed(2)}
          </p>
        </div>

        {!showCardForm ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Payment Mode</h3>
            <div className="grid grid-cols-3 gap-4">
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => setPaymentMode('cash')}
                className={`p-4 rounded-xl flex flex-col items-center ${
                  paymentMode === 'cash'
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Wallet size={24} className="text-green-600 mb-2" />
                <span className="text-sm font-medium">Cash</span>
              </motion.button>
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => setPaymentMode('card')}
                className={`p-4 rounded-xl flex flex-col items-center ${
                  paymentMode === 'card'
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <CreditCard size={24} className="text-blue-600 mb-2" />
                <span className="text-sm font-medium">Card</span>
              </motion.button>
              <motion.button
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => setPaymentMode('upi')}
                className={`p-4 rounded-xl flex flex-col items-center ${
                  paymentMode === 'upi'
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Smartphone size={24} className="text-purple-600 mb-2" />
                <span className="text-sm font-medium">UPI</span>
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleCardInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  placeholder="123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {showCardForm && (
            <motion.button
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={handleBackToPaymentModes}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors duration-300"
            >
              Back
            </motion.button>
          )}
          <motion.button
            whileHover={buttonHover}
            whileTap={buttonTap}
            onClick={handlePayment}
            className={`${showCardForm ? 'flex-1' : 'w-full'} bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300`}
          >
            {showCardForm ? 'Pay Now' : 'Complete Payment'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal; 