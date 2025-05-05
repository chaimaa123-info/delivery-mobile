import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Map icon fixed on the left */}
      <Image
        source={require('../assets/images/map.png')}
        style={styles.map}
        resizeMode="contain"
      />

      {/* Truck image moving from left to right */}
      <MotiView
        from={{ translateX: -200 }}
        animate={{ translateX: width }}
        transition={{
          type: 'timing',
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        }}
        style={styles.truckWrapper}
      >
        <Image
          source={require('../assets/images/delivery-truck.png')}
          style={styles.truck}
          resizeMode="contain"
        />
      </MotiView>

      <Text style={styles.text}>Bienvenue..!</Text>
      <Text style={styles.subtext}>Chargement en cours...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckWrapper: {
    position: 'absolute',
    top: 150,
  },
  truck: {
    width: 100,
    height: 70,
  },
  map: {
    position: 'absolute',
    right: 2,
    top: 150,
    width: 50,
    height: 50,
  },
  text: {
    marginTop: 50,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtext: {
    fontSize: 18,
    marginTop: 10,
    color: '#6b7280',
  },
});
