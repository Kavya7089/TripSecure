import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import axios from 'axios';

const LOCATION_TASK_NAME = 'ALWAYS_ON_LOCATION';
const VOICE_TASK_NAME = 'ALWAYS_ON_VOICE';

// Step 1: Background location task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) return console.error(error);
  if (data) {
    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;

    // Send to backend to check risk area
    try {
      await axios.post('http://<backend-url>/voice-command', { lat: latitude, lng: longitude });
    } catch (e) {
      console.error('Error sending location:', e.message);
    }
  }
});

export const startBackgroundLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted' && bgStatus === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 50,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Smart Tourist Safety',
        notificationBody: 'Always-On mode is active',
      },
    });
  }
};

// Step 2: Voice task (simplified example)
export const startBackgroundVoice = async () => {
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();

  setInterval(async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const formData = new FormData();
      formData.append('audio', { uri, type: 'audio/wav', name: 'voice.wav' });

      const res = await axios.post('http://<backend-url>/voice-command', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('AI Response:', res.data.reply);

      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
    } catch (err) {
      console.error('Voice error:', err.message);
    }
  }, 15000); // Check every 15 sec
};
