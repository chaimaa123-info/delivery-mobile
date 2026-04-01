// ScanPage.tsx
import { useTourStore } from '@/store/useTourStore';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';
import type { BarcodeScanningResult } from 'expo-camera';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Button, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const { width } = Dimensions.get('window');


export default function ScanPage({ searchParams }: { searchParams: { mode?: string } }){     
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  const [linePosition] = useState(new Animated.Value(0)); 
  const [scaleValue] = useState(new Animated.Value(1));
  const scrollViewRef = useRef<ScrollView>(null); 
  const [sound, setSound] = useState<any>(null);
  const [errorSound, setErrorSound] = useState<any>(null); 
  const { height } = Dimensions.get('window');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [scanCooldown, setScanCooldown] = useState(false);
  const lineAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const cornersAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [showRedOverlay, setShowRedOverlay] = useState(false);   
  const router = useRouter();
  const isFocused = useIsFocused(); // Ajoute ce hook
  
  const [scannedColis, setScannedColis] = useState<any[]>([]); // tableau temporaire
  const frameHeight = 200; // Hauteur du cadre de scan

const { id } = useLocalSearchParams<{ id: string }>();
 const setRescannedCode = useTourStore(state => state.setRescannedCode);
 
 const { mode } = useLocalSearchParams<{ mode?: string }>();
  console.log('Mode:', mode);


async function onBarCodeScanned(event: BarcodeScanningResult) {
  if (scanCooldown) return;
  setScanCooldown(true);

  const barcode = event.data; // c’est ici qu’est le code-barres
  setRescannedCode(id, barcode);

 // Attends 500ms pour être sûr que le store est bien mis à jour
  setTimeout(() => {
    router.back(); // Ne pas quitter immédiatement
  }, 500);

  // Cooldown réactivé après un moment
  setTimeout(() => {
    setScanCooldown(false);
  }, 1000);
}


  useEffect(() => {   
    if (isFocused && isScanning) {
      lineAnimationRef.current = Animated.loop(
        Animated.sequence([
        Animated.timing(linePosition, { 
        toValue: 1, duration: 1000, useNativeDriver: true }), 
        Animated.timing(linePosition, { toValue: 0, duration: 1000, useNativeDriver: true })])
      );  
      lineAnimationRef.current.start();

      cornersAnimationRef.current = Animated.loop(
        Animated.sequence([
        Animated.timing(scaleValue, { toValue: 1.2, duration: 500, useNativeDriver: true }), 
        Animated.timing(scaleValue, 
        { toValue: 1, duration: 500, useNativeDriver: true })])
      );
      cornersAnimationRef.current.start();
    } else {
      lineAnimationRef.current?.stop();
      cornersAnimationRef.current?.stop();
      linePosition.setValue(0);
      scaleValue.setValue(1);
    }
  }, [isFocused, isScanning]);

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: successSound } = await Audio.Sound.createAsync(require('../../assets/Sound-scanner-beep.mp3'));
      const { sound: errorSound } = await Audio.Sound.createAsync(require('../../assets/error.mp3'));  // Ajoute ton son d'erreur ici
      setSound(successSound);
      setErrorSound(errorSound);  // Stocke le son d'erreur
    };
    loadSounds();
    return () => {
      if (sound) sound.unloadAsync();
      if (errorSound) errorSound.unloadAsync();  // Libère la ressource du son d'erreur
    };
  }, []);


  useEffect(() => {
    if (scannedCodes.length > 0) {
      setTimeout(() => { scrollViewRef.current?.scrollToEnd({ animated: true });
     }, 100);
    }
  }, [scannedCodes]);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );   
  }

async function handleBarCodeScanned({ data }: { data: string }) {
  if (scanCooldown) return;
  setScanCooldown(true);

  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    if (!accessToken) throw new Error('Token manquant');

    const response = await fetch(`https://www2.sapresslogistics.ma/api/mobile/v1/colis/${data}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Erreur API:', errorText);
      throw new Error('Colis introuvable');
    }

    const colisData = await response.json();

    // Si on est en mode rescanner, on stocke et on redirige
    if (mode === 'rescanner') {
      setRescannedCode(id, data);
      router.back();  // ← redirige vers la page d'origine
      return; // on sort ici pour éviter le reste du code
    }

    // Mode normal
    if (scannedCodes.includes(data)) {
      setErrorMessage('Ce colis a déjà été scanné !');
      setShowRedOverlay(true);
      if (errorSound) await errorSound.replayAsync();
      setTimeout(() => {
        setErrorMessage('');
        setShowRedOverlay(false);
      }, 1000);
    } else {
      setScannedCodes((prev) => [...prev, data]);
      setScannedColis((prev) => [...prev, colisData]);
      if (sound) await sound.replayAsync();
    }
  } catch (error) {
    console.error("Erreur:", error);
    setErrorMessage('Colis introuvable');
    setShowRedOverlay(true);
    if (errorSound) await errorSound.replayAsync();
    setTimeout(() => {
      setErrorMessage('');
      setShowRedOverlay(false);
    }, 2000);
  } finally {
    setTimeout(() => {
      setScanCooldown(false);
    }, 2000);
  }
}

function handleValider() {
  if (scannedColis.length === 0) return; // rien à valider

  // Ajouter les colis scannés au store global
  scannedColis.forEach(colis => {
    useTourStore.getState().addColis(colis);
  });

  // Vider la liste locale pour faire disparaître les colis scannés immédiatement
  setScannedCodes([]);
  setScannedColis([]);

  // Naviguer vers la page d'accueil (HomePage)
  router.replace('/HomePage');
}


  function handleDeleteCode(index: number) {
    setScannedCodes((prev) => prev.filter((_, i) => i !== index));
  }
  const validateTour = async () => {
  if (scannedCodes.length > 0) {
    Alert.alert(
      "Validation de la tournée",
      "La tournée a été validée avec succès.",
      [
        {
          text: "OK",
          onPress: async () => {
            const addColis = useTourStore.getState().addColis;

            // Ajouter les colis scannés au store
            scannedColis.forEach((colis) => {
              addColis(colis);
            });

            // Réinitialiser la tournée (si tu veux enregistrer dans l’historique, sinon retire cette ligne)
            useTourStore.getState().validerTournee();

            // Réinitialiser l’état local
            setScannedCodes([]);
            setScannedColis([]);


            // Aller à la page d’accueil
            router.replace('/HomePage');
          },
        },
      ],
      { cancelable: false }
    );
  }
};
  
   
  function refuseTour() {
    if (scannedCodes.length > 0) {
      Alert.alert(
        "Refus de la tournée",
        "Voulez-vous vraiment refuser cette tournée ? Tous les colis scannés seront supprimés.",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Confirmer",
            style: "destructive",
            onPress: () => {
              setScannedCodes([]); // Vide la liste des colis
              useTourStore.getState().resetColis(); // Si tu veux aussi le vider dans le store
              alert('Tournée refusée');
            }
          }
        ]
      );
    }
  }
      

  function exitScan() {
    if (scannedCodes.length > 0) {
      Alert.alert(
        "Quitter le scan",
        "Des colis ont été scannés. Voulez-vous vraiment quitter sans valider ou refuser ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Oui",
            style: "destructive",
            onPress: () => {
              setIsScanning(false);
              setScannedCodes([]);
              router.replace("/HomePage");
            }
          }
        ]
      );
    } else {
      setIsScanning(false);
      router.replace("/HomePage");
    }
  }
  
 


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={exitScan} style={styles.exitButton}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
 
      {isFocused && (
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'code128', 'ean13', 'ean8'] }}
        onBarcodeScanned={mode === 'rescanner' ? onBarCodeScanned : handleBarCodeScanned}

      >
        {showRedOverlay && <View style={styles.redOverlay} />}

        <View style={styles.scanFrame}>
          <Animated.View
            style={[styles.scanLine, {
              transform: [{ 
             translateY: linePosition.interpolate({
             inputRange: [0, 1],
             //outputRange: [0, height * 0.2] 
             outputRange: [0, frameHeight - 2]
            }) }]
            }]}
          />
          <View style={styles.scanCorners}>
            <Animated.View style={[styles.corner, styles.topLeft, { transform: [{ scale: scaleValue }] }]} />
            <Animated.View style={[styles.corner, styles.topRight, { transform: [{ scale: scaleValue }] }]} />
            <Animated.View style={[styles.corner, styles.bottomLeft, { transform: [{ scale: scaleValue }] }]} />
            <Animated.View style={[styles.corner, styles.bottomRight, { transform: [{ scale: scaleValue }] }]} />
          </View>
        </View>

        {errorMessage  !== '' && (
          <View style={styles.errorInScanZone}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        )}  
        
        {scannedCodes.length > 0 && (
          <View style={styles.codes}>
            <Text style={[styles.subTitle, { color: 'white' }]}>Colis scannés :</Text>
            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContent}
             showsVerticalScrollIndicator={true}
             >
              {scannedCodes.map((code, index) => (
                <View key={index} style={styles.codeContainer}>
                  <Text style={styles.codeText}>{code}</Text>
                  <TouchableOpacity onPress={() => handleDeleteCode(index)} style={styles.deleteButton}>
                    <Ionicons name="trash-bin" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {scannedCodes.length > 0 && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={refuseTour} style={styles.refuseButton}>
              <Text style={styles.buttonText}>Refuser</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleValider} style={styles.validateButton}>
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        )}
      </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    position: 'relative',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  scanFrame: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    width: '80%',
    height: '20%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scanCorners: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  corner: {
    width: 30,
    height: 30,
    position: 'absolute',
    borderColor: 'white',  
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  codes: {
    position: 'absolute',
    top: '51%',
    width: '100%',
    backgroundColor: 'rgba(17, 152, 57, 0.5)',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    maxHeight: '52%',
    
  },

  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    padding: 10,  // Ajoute un peu de padding pour le contenu
    backgroundColor: 'rgba(218, 217, 233, 0.5)',  // Fond blanc pour le contraste
    borderRadius: 10,  // Coins arrondis pour l'encadré
    borderWidth: 2,  // Ajoute une bordure autour de chaque code
    borderColor: '#ddd',  // Couleur de la bordure
  },
  codeText: {
    fontSize: 20,
    color: 'black',  
    //textAlign: 'center',
    flex: 1,  // Permet au texte de prendre l'espace restant
  },
  deleteButton: {     
    backgroundColor: 'transparent',
    padding: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  refuseButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  validateButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  exitButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 30,
    zIndex: 999,
  },
  
  message: {
    fontSize: 16,
    color: '#000',
  },
  redOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  subTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  scrollViewContent: {
    paddingBottom: 10, // Ajoute un peu d'espace en bas du ScrollView pour mieux voir les derniers éléments
  },

  errorInScanZone: {
    position: 'absolute',
    top: '33%',  // Ajustez pour mieux centrer verticalement dans la zone de scan
    left: '50%',
    transform: [{ translateX: -width * 0.4 }],  // Centré horizontalement
    width: '80%',  // Largeur de la zone d'erreur
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 10,
    justifyContent: 'center',  // Centrer le texte à l'intérieur de la vue
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Assure que le texte est centré
  },
});    