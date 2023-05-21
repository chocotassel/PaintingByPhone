import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Gyroscope, Accelerometer, Magnetometer } from 'expo-sensors';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [isTracking, setIsTracking] = useState(false);

  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [magnetData, setMagnetData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // 请求传感器权限
    (async () => {
      Gyroscope.requestPermissionsAsync();
      Accelerometer.requestPermissionsAsync();
      Magnetometer.requestPermissionsAsync();
    })();
  }, []);

  const startTracking = async () => {
    setIsTracking(true);

    Gyroscope.setUpdateInterval(100);
    Accelerometer.setUpdateInterval(100);
    Magnetometer.setUpdateInterval(100);

    Gyroscope.addListener((data) => setGyroData(data));
    Accelerometer.addListener((data) => setAccelData(data));
    Magnetometer.addListener((data) => setMagnetData(data));
  };

  const stopTracking = () => {
    setIsTracking(false);
    Gyroscope.removeAllListeners();
    Accelerometer.removeAllListeners();
    Magnetometer.removeAllListeners();
    setPosition({ x: 0, y: 0, z: 0 });
  };

  useEffect(() => {
    if (isTracking) {
      setPosition({
        x: (gyroData.x + accelData.x + magnetData.x) / 3,
        y: (gyroData.y + accelData.y + magnetData.y) / 3,
        z: (gyroData.z + accelData.z + magnetData.z) / 3,
      });
    }
  }, [gyroData, accelData, magnetData, isTracking]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>X: {position.x.toFixed(2)}</Text>
      <Text style={styles.text}>Y: {position.y.toFixed(2)}</Text>
      <Text style={styles.text}>Z: {position.z.toFixed(2)}</Text>
      {!isTracking ? (
        <TouchableOpacity onPress={startTracking} style={styles.button}>
          <Text style={styles.buttonText}>开始追踪</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={stopTracking} style={styles.button}>
          <Text style={styles.buttonText}>停止追踪</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    backgroundColor: '#0080FF',
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  });
