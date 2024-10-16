import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { Gyroscope, Accelerometer } from 'expo-sensors'; 
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [tracking, setTracking] = useState<boolean>(false);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [rotation, setRotation] = useState<{ x: number; y: number; z: number } | null>(null);
  const [acceleration, setAcceleration] = useState<{ x: number; y: number; z: number } | null>(null);

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const gyroSubscription = useRef<any>(null);
  const accelSubscription = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const savedRoute = await AsyncStorage.getItem('route');
      const savedLocation = await AsyncStorage.getItem('location');

      if (savedRoute) setRoute(JSON.parse(savedRoute));
      if (savedLocation) setLocation(JSON.parse(savedLocation));

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se denegó el permiso para acceder a la ubicación');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();

    return () => stopTracking(); // Limpiar subscripciones al desmontar el componente
  }, []);

  const saveData = async (newRoute: LatLng[]) => {
    try {
      await AsyncStorage.setItem('route', JSON.stringify(newRoute));
      if (location) {
        await AsyncStorage.setItem('location', JSON.stringify(location));
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la información.');
    }
  };

  const startGyroscopeTracking = () => {
    Gyroscope.setUpdateInterval(100); // Intervalo de actualización en milisegundos
    gyroSubscription.current = Gyroscope.addListener(gyroscopeData => {
      setRotation({
        x: gyroscopeData.x || 0,
        y: gyroscopeData.y || 0,
        z: gyroscopeData.z || 0,
      });
    });
  };

  const stopGyroscopeTracking = () => {
    if (gyroSubscription.current) {
      gyroSubscription.current.remove();
      gyroSubscription.current = null;
    }
  };

  const startAccelerometerTracking = () => {
    Accelerometer.setUpdateInterval(100); // Intervalo de actualización en milisegundos
    accelSubscription.current = Accelerometer.addListener(accelData => {
      setAcceleration({
        x: accelData.x || 0,
        y: accelData.y || 0,
        z: accelData.z || 0,
      });
    });
  };

  const stopAccelerometerTracking = () => {
    if (accelSubscription.current) {
      accelSubscription.current.remove();
      accelSubscription.current = null;
    }
  };

  const startTracking = async () => {
    setTracking(true);

    locationSubscription.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 1 },
      (newLocation) => {
        const { latitude, longitude } = newLocation.coords;

        setLocation(newLocation);
        setRoute((prevRoute) => {
          const updatedRoute = [...prevRoute, { latitude, longitude }];
          saveData(updatedRoute); // Guardar cada punto en caché
          return updatedRoute;
        });
      }
    );

    startGyroscopeTracking(); // Iniciar el seguimiento del giroscopio
    startAccelerometerTracking(); // Iniciar el seguimiento del acelerómetro
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setTracking(false);
    stopGyroscopeTracking(); // Detener seguimiento del giroscopio
    stopAccelerometerTracking(); // Detener seguimiento del acelerómetro
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
          />
        )}
        <Polyline coordinates={route} strokeColor="red" strokeWidth={3} />
      </MapView>

      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.footerText}>Usuario: Jeffry</Text>
          <Text style={styles.footerText}>
            Estado: {tracking ? 'En seguimiento' : 'Detenido'}
          </Text>
          {rotation && (
            <Text style={styles.footerText}>
              Rotación: x: {rotation.x.toFixed(2)}, y: {rotation.y.toFixed(2)}, z: {rotation.z.toFixed(2)}
            </Text>
          )}
          {acceleration && (
            <Text style={styles.footerText}>
              Aceleración: x: {acceleration.x.toFixed(2)}, y: {acceleration.y.toFixed(2)}, z: {acceleration.z.toFixed(2)}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => {
            tracking ? stopTracking() : startTracking();
          }}
        >
          <FontAwesome
            name={tracking ? 'pause' : 'play'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    marginVertical: 2,
    color: 'white',
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
