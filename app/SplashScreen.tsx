//app/SplashScreen
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login'); 
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (    
    <View style={styles.container}>
      <Image source={require('../assets/images/logo_sapress.png')} style={styles.logo} />
    </View>
  );
}
   
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
});
