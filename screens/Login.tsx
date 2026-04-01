// screens/Login.tsx
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { logoStyles, styles } from '../components/styles';
import { useAuth } from '../context/AuthContext';
import { odooURLs } from '../utils/odooConfig';


const screenHeight = Dimensions.get('window').height;

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [odooVersion, setOdooVersion] = useState<string>('Odoo v-13');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const { token, setToken, userName, setUserName } = useAuth();
  const apiURLs = odooURLs[odooVersion];
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false); 
  const [infoMessage, setInfoMessage] = useState(''); 
  const [showLoginError, setShowLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');



  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        router.replace('/(tabs)/HomePage');
      }
    };
    checkToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIdentifier('');
      setPassword('');
    }, [])
  );

  
  const handleLogin = async () => {
    if (!identifier || !password) {
      setShowError(true);

      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(apiURLs['url_auth'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: { login: identifier, password: password },
        }),
      });

      const data = await response.json();

      if (data.result && data.result.access_token) {
        const accessToken = data.result.access_token;
        const userName = data.result.user_name;

        await AsyncStorage.setItem('access_token', accessToken);
        await AsyncStorage.setItem('user_name', userName);

        setToken(accessToken);
        setUserName(userName);

        router.replace('/(tabs)/HomePage');
      } else {
       setLoginErrorMessage('Login ou mot de passe incorrect.');
      setShowLoginError(true);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
     setLoginErrorMessage('Une erreur est survenue lors de la connexion.');
     setShowLoginError(true);
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
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        Animated.timing(opacityAnim, {
          toValue: 1,
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
    setInfoMessage(`Vous êtes maintenant dans ${version}`); 
    setShowInfo(true); 
  };


const [isFocused, setIsFocused] = useState(false);
const labelAnim = useRef(new Animated.Value(identifier ? 1 : 0)).current;

useEffect(() => {
  Animated.timing(labelAnim, {
    toValue: isFocused || identifier ? 1 : 0,
    duration: 200,
    useNativeDriver: false,
  }).start();
}, [isFocused, identifier]);



  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../assets/images/TMS.jpg')} 
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"
        imageStyle={{ opacity: 0.6 }} // Transparence de l'image
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
            <View style={logoStyles.logoContainer}>
              <Image
                source={require('../assets/images/logo_sapress.png')}
                style={logoStyles.logoImage}
                resizeMode="contain"
              />
            </View>
 
  <View style={{ alignItems: 'center', marginVertical: 20, paddingHorizontal: 20 }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center', marginTop: 80  }}>
    Bienvenu sur TMS,
  </Text>
  <Text style={{ fontSize: 16, color: 'white', textAlign: 'center', marginTop: 10 }}>
    Connectez-vous pour Consulter vos Tournées 
  </Text>
</View>

            <View
              style={{
                position: 'absolute',
                top: 40,
                right: -30,
                width: 106,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={{
                  width: 80,
                  height: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 30, 
                  borderColor: '#ccc',
                  justifyContent: 'center',
                
                }}
              >
                
                <MaterialIcons name="menu" size={40} color="#6fbd45"  />
              </TouchableOpacity>

              {showDropdown && (
                <View
                  style={{
                  backgroundColor:'rgba(46, 51, 47, 0.5)' ,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 15,
                    marginTop: 10,
                    width: 150,
                    alignSelf: 'center',
                    paddingVertical: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <TouchableOpacity onPress={() => selectOdooVersion('Odoo v-13')} style={{ padding: 10 }}>
                    <Text style={{ color: 'white' }}>Odoo v-13</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => selectOdooVersion('Odoo v-18')} style={{ padding: 10 }}>
                    <Text style={{ color: 'white' }}>Odoo v-18</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Formulaire */}
          <View
            style={{
               flex: 9,
               width: '100%',
              paddingHorizontal: 10,
              //paddingVertical: 180,
              paddingTop: 20,
             borderRadius: 30,
             marginVertical: screenHeight * 0.2,
            backgroundColor: 'rgba(2, 64, 6, 0.5)',
            marginBottom: 200,
            marginTop:40,
            
            }}
          >
            {/* Login */}
            <View style={[styles.inputGroup, { marginBottom: 35 }]}>
              
              <View style={styles.inputWithIcon}>
                <MaterialIcons name="person" size={30} color="white" style={styles.icon} />
                <View style={{ flex: 1 }}>
      <Animated.Text
        style={{
          position: 'absolute',
          left: 0,
          top: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [12, -19], // hauteur entre normal et focus
          }),
          fontSize: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
          }),
          color: 'rgba(246, 234, 234, 0.7)',
          fontWeight: 'bold',
          
        }}
      >
        Login
      </Animated.Text>
                <TextInput
                  style={[styles.inputField, { paddingTop: 19, color: 'white' }]}
                  placeholderTextColor="rgba(246, 234, 234, 0.7)"
                  value={identifier}
                  onChangeText={setIdentifier}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none" 
                  
                />
              </View>
            </View>  
             </View> 
            {/* Mot de passe */}
            <View style={[styles.inputGroup, { marginBottom: 19 }]}>
              
              <View style={styles.inputWithIcon}>
                <MaterialIcons name="lock" size={30} color="white" style={styles.icon} />
                
                <View style={{ flex: 1 }}>
      <Animated.Text
        style={{
          position: 'absolute',
          left: 0,
          top: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [12, -19], // hauteur entre normal et focus
          }),
          fontSize: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
          }),
          color: 'rgba(246, 234, 234, 0.7)',
          fontWeight: 'bold',
          
        }}
      >
        Mot de passe
      </Animated.Text>

                <TextInput
                 style={[styles.inputField, { color: 'white' }]}
                 // placeholder="Mot de passe"
                  placeholderTextColor="rgba(246, 234, 234, 0.7)"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                   onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoCapitalize="none"
                />
                </View>
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <MaterialIcons
                    name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bouton animé */}
            <Animated.View
              style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim, marginTop: 10 }}
            >
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  {
                    backgroundColor: 'rgba(63,61,66,255)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
                disabled={isLoading}
                onPress={animateButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#6fbd45" size="small" />
                ) : (
                  <Text style={styles.loginText}>Se connecter</Text>
                )}
              </TouchableOpacity>
              {/* 🔴 Modal d'erreur affiché si un champ est vide */}
      {showError && (
        <Modal
          transparent
          animationType="fade"
          visible={showError}
          onRequestClose={() => setShowError(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Erreur</Text>
              <Text style={{ marginTop: 10 }}>Veuillez remplir tous les champs</Text>
              <TouchableOpacity onPress={() => setShowError(false)} style={{ marginTop: 15 }}>
                <Text style={{ color: 'green', fontWeight: 'bold'  }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

       {/* ✅ Modal d'information de sélection */}
      {showInfo && (
        <Modal
          transparent
          animationType="fade"
          visible={showInfo}
          onRequestClose={() => setShowInfo(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Version sélectionnée</Text>
              <Text style={{ marginTop: 10 }}>{infoMessage}</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)} style={{ marginTop: 15 }}>
                <Text style={{ color: 'green', fontWeight: 'bold'  }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

{showLoginError && (
  <Modal
    transparent
    animationType="fade"
    visible={showLoginError}
    onRequestClose={() => setShowLoginError(false)}
  >
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Erreur de connexion</Text>
        <Text style={{ marginTop: 10 }}>{loginErrorMessage}</Text>
        <TouchableOpacity onPress={() => setShowLoginError(false)} style={{ marginTop: 15 }}>
          <Text style={{ color: 'green' , fontWeight: 'bold' }}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

            </Animated.View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Login;
