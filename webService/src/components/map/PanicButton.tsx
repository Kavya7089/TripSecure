import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useAppStore } from '../../lib/store';
import { wsService } from '../../lib/websocket';

export const PanicButton: React.FC = () => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { user } = useAppStore();

  const handlePanicPress = () => {
    setIsEmergencyMode(true);
    startCountdown();
  };

  const startCountdown = () => {
    let count = 5;
    setCountdown(count);
    
    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(timer);
        sendPanicAlert();
      }
    }, 1000);
  };

  const sendPanicAlert = () => {
    // Get current location (mock)
    const location = {
      id: Date.now().toString(),
      latitude: 40.7589 + (Math.random() - 0.5) * 0.01,
      longitude: -73.9851 + (Math.random() - 0.5) * 0.01,
      address: 'Times Square, NYC',
      timestamp: new Date(),
      accuracy: 5
    };

    wsService.sendPanicAlert(location);
    setIsEmergencyMode(false);
    setCountdown(0);
    
    // Show confirmation
    alert('Emergency alert sent! Authorities and your emergency contacts have been notified.');
  };

  const cancelPanic = () => {
    setIsEmergencyMode(false);
    setCountdown(0);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePanicPress}
        className="relative w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center text-white font-bold"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-red-500 rounded-full opacity-30"
        />
        <AlertTriangle className="h-8 w-8" />
      </motion.button>

      <Modal
        isOpen={isEmergencyMode}
        onClose={cancelPanic}
        title="Emergency Alert"
        size="sm"
      >
        <div className="text-center space-y-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto"
          >
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </motion.div>

          {countdown > 0 ? (
            <>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sending Emergency Alert in
                </h3>
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-6xl font-bold text-red-600"
                >
                  {countdown}
                </motion.div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-600">
                  Emergency services and your contacts will be notified with your location.
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant={isRecording ? 'danger' : 'secondary'}
                    onClick={toggleRecording}
                    className="flex items-center space-x-2"
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    <span>{isRecording ? 'Stop Recording' : 'Record Audio'}</span>
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="danger"
                  onClick={sendPanicAlert}
                  className="flex-1"
                >
                  Send Now
                </Button>
                <Button
                  variant="secondary"
                  onClick={cancelPanic}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-green-600 mb-4">
                Emergency Alert Sent!
              </h3>
              <p className="text-gray-600">
                Help is on the way. Stay safe and wait for assistance.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};