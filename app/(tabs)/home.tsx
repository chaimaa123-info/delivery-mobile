// app/(tabs)/home.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MotiView
        style={styles.vehicle}
        from={{ translateX: -100 }}
        animate={{ translateX: 300 }}
        transition={{
          type: 'timing',
          duration: 5000,
          repeat: Infinity,
          easing: Easing.inOut(Easing.ease),
        }}
      >
        <View style={styles.vehicleBody}>
          <Text style={styles.text}>🚚</Text>
        </View>
      </MotiView>
      <View style={styles.tabs}>
        <Text>Tab bar avec des options</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  vehicle: {
    position: 'absolute',
    bottom: 50,
  },
  vehicleBody: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
  tabs: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
});
