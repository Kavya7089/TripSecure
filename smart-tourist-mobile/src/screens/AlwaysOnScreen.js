import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { startBackgroundLocation, startBackgroundVoice } from '../services/backgroundService';

export default function AlwaysOnScreen() {
  const [alwaysOn, setAlwaysOn] = useState(false);

  const toggleAlwaysOn = async () => {
    if (!alwaysOn) {
      await startBackgroundLocation();
      await startBackgroundVoice();
      setAlwaysOn(true);
    } else {
      // Stop tasks (optional)
      setAlwaysOn(false);
    }
  };

  return (
    <View>
      <Button
        title={alwaysOn ? 'Turn Off Always-On Mode' : 'Turn On Always-On Mode'}
        onPress={toggleAlwaysOn}
      />
      <Text>Status: {alwaysOn ? 'Active' : 'Inactive'}</Text>
    </View>
  );
}
