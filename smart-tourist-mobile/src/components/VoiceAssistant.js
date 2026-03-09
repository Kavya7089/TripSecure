import { Audio } from 'expo-av';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';

export default function VoiceAssistant({ userLocation }) {
  const [recording, setRecording] = useState();
  const [response, setResponse] = useState('');

  const startRecording = async () => {
    const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(recording);
  };

  const stopRecording = async () => {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    const formData = new FormData();
    formData.append('audio', {
      uri,
      type: 'audio/wav',
      name: 'voice.wav',
    });
    formData.append('lat', userLocation.lat);
    formData.append('lng', userLocation.lng);

    const res = await axios.post('http://<backend-url>/voice-command', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setResponse(res.data.reply);
  };

  return (
    <View>
      <Button onPress={startRecording} title="Start Recording" />
      <Button onPress={stopRecording} title="Stop Recording" />
      <Text>{response}</Text>
    </View>
  );
}
