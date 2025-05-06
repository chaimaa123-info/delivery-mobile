// screens/Login.tsx
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { logoStyles, styles } from '../components/styles';
import { useAuth } from '../context/AuthContext';

const themeColors = {
  bg: '#007AFF',};   

const screenHeight = Dimensions.get('window').height;

const Login =  ()  => {  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [odooVersion, setOdooVersion] = useState<string>('Odoo v-13');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current; // Ajout pour fondu
  const { token, setToken, userName, setUserName } = useAuth();

// ✅ Vérifie si token déjà présent
  useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      router.replace('/(tabs)/HomePage');
    }
  };
  checkToken();
}, []);

const handleLogin = async () => {
  if (!identifier || !password) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs');
    return;
  }

  try {
    setIsLoading(true);

    const odooURL =
      odooVersion === 'Odoo v-13'
        ? 'https://www2.sapresslogistics.ma/api/v1/auth/token/'
        : 'https://ton-url-odoo-18.com/web/session/authenticate';

    const response = await fetch(odooURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          login: identifier,
          password: password,
        },
      }),
    });

    const data = await response.json();
   

    if (data.result && data.result.access_token) {
      const accessToken = data.result.access_token;
      const userName = data.result.user_name;

      // ✅ Stocke dans AsyncStorage
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('user_name', userName);

      setToken(accessToken);
      setUserName(userName);

      router.replace('/(tabs)/HomePage');
    } else {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
    }
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
  } finally {
    setIsLoading(false);
  }
};
  const animateButton = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacityAnim, {
        toValue: 0.5, // Devient plus transparent
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        Animated.timing(opacityAnim, {
          toValue: 1, // Reprend son opacité normale
          duration: 300,
          useNativeDriver: true,
        }).start();
        handleLogin();
      }, 2000);
    });
  };

  const selectOdooVersion = (version: string) => {
    setOdooVersion(version);
    setShowDropdown(false);
    Alert.alert('Version sélectionnée', `Vous êtes maintenant dans ${version}`);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { flex: 1 }]}>

        {/* Partie supérieure avec logo et sélecteur Odoo */}
        <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 50 }}>
          <View style={logoStyles.logoContainer}>
            <Image source={require('../assets/images/logo.png')} style={logoStyles.logoImage} resizeMode="contain" />
          </View>

          {/* Sélecteur Odoo */}
          <View style={{
            paddingHorizontal: 8,
            paddingTop: 10,
            position: 'absolute',
            top: 30,
            right: -30,
            width: 106,
          }}>
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              style={{
                width: 80,
                height: 50,  
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#ccc',
                padding: 8,
                borderRadius: 25,
                backgroundColor: '#fff',
                justifyContent: 'center',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>Odoo</Text>
              <MaterialIcons name={showDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} style={{ marginLeft: 5 }} />
            </TouchableOpacity>

            {showDropdown && (
              <View style={{
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 15,
                marginTop: 10,
                width: 150,
                alignSelf: 'center',
                paddingVertical: 5,
                overflow: 'hidden',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
                <TouchableOpacity onPress={() => selectOdooVersion('Odoo v-13')} style={{ padding: 10 }}>
                  <Text>Odoo v-13</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectOdooVersion('Odoo v-18')} style={{ padding: 10 }}>
                  <Text>Odoo v-18</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Partie inférieure - Formulaire */}
        <View style={{
          flex: 5,
          backgroundColor: 'rgb(102, 119, 169)',
          width: '115%',
          marginLeft: '-7.5%',
          paddingHorizontal: 16,
          paddingTop: 50,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginTop: screenHeight * 0.2,
        }}>
          {/* Email */}
          <View style={[styles.inputGroup, { marginBottom: 40 }]}>
            <Text style={[styles.label, { color: "black" }]}>Email</Text>
            <View style={styles.inputWithIcon}>
              <MaterialIcons name="email" size={20} color="blue" style={styles.icon} />
              <TextInput
                style={styles.inputField}
                placeholder="user@gmail.com"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Mot de passe */}
          <View style={[styles.inputGroup, { marginBottom: 30 }]}>
            <Text style={[styles.label, { color: "black" }]}>Mot de passe</Text>
            <View style={styles.inputWithIcon}>
              <MaterialIcons name="lock" size={20} color="blue" style={styles.icon} />
              <TextInput
                style={styles.inputField}
                placeholder="Entrez votre mot de passe"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
          </View>

        

          {/* Bouton animé */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim, marginTop: 20 }}>
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: 'rgb(43, 28, 156)', justifyContent: 'center', alignItems: 'center' }
              ]}
              disabled={isLoading}
              onPress={animateButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

        </View>  
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;