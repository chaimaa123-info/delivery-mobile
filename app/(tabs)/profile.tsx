import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Profile = () => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission d\'accès à la caméra refusée!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const removePhoto = () => {
    setImageUri(null);
  };
const [errorDelay, setErrorDelay] = useState('0.75');
  const [barcodeReader, setBarcodeReader] = useState('camera');
  const [autoEntry, setAutoEntry] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [externalTransporter, setExternalTransporter] = useState(false);
  const [gpsDisabled, setGpsDisabled] = useState(false);
 const [scannerType, setScannerType] = useState('camera');
 const [printingEnabled, setPrintingEnabled] = useState(false);
  const [printFormat, setPrintFormat] = useState('ticket');


const printColisDetails = async (colis: {
  numero: string;
  client: string;
  adresse: string;
  telephone: string;
  montant: string;
}) => {
  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #6EBD48; }
          table { width: 100%; margin-top: 20px; border-collapse: collapse; }
          td, th { padding: 8px; border: 1px solid #ccc; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Détails du Colis</h1>
        <table>
          <tr><th>Numéro</th><td>${colis.numero}</td></tr>
          <tr><th>Client</th><td>${colis.client}</td></tr>
          <tr><th>Adresse</th><td>${colis.adresse}</td></tr>
          <tr><th>Téléphone</th><td>${colis.telephone}</td></tr>
          <tr><th>Montant</th><td>${colis.montant}</td></tr>
        </table>
      </body>
    </html>
  `;

  await Print.printAsync({ html: htmlContent });
};

  return (
    <ImageBackground
      source={require('../../assets/images/TMS1.png')}
      style={styles.imageBackground}
      resizeMode="cover"
    >
      <BlurView intensity={200} tint="light" style={styles.blurView}>
        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="rgb(110, 189, 72)"
            translucent
          />

          <View style={styles.customHeader}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Paramètres</Text>
          </View>
 <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.cameraCircle}
              onPress={openCamera}
              activeOpacity={0.8}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.profileImage} />
              ) : (
                <Ionicons name="camera" size={28} color="white" />
              )}
            </TouchableOpacity>

            {/* Bouton supprimer photo, affiché seulement si photo prise */}
            {imageUri && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={removePhoto}
              >
                <Ionicons name="close-circle" size={24} color="grey" />
              </TouchableOpacity>
            )}




 <Text style={styles.title2}>Anouar Ahmed </Text>

           <Text style={styles.title1}>   Nom d'utilisateur : 
           
            <Text style={styles.highlight}>  a.Anouar </Text>
            </Text>



            <Text style={styles.title}>
Titre du poste: <Text style={styles.highlight}>Livreur</Text>
</Text>


<View style={styles.sectionTitleContainer}>
  <Text style={styles.sectionTitleText}>Options du lecteur de codes-barres</Text>

<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
  <MaterialCommunityIcons
    name="timer-outline"
    size={24}
    color="green"
    style={{ marginRight: 8,top:10 }}
  />
  <Text style={styles.sectionTitleText2}>Delai de visibilité du message d'erreur </Text>
</View>


  <View style={styles.iconPickerContainer}>
    
    
    <Picker
      selectedValue={errorDelay}
      style={styles.picker}
      onValueChange={(itemValue) => setErrorDelay(itemValue)}
    >
      <Picker.Item label="0.5 Seconde" value="0.5" />
      <Picker.Item label="0.75 Seconde" value="0.75" />
      <Picker.Item label="1 Seconde" value="1" />
    </Picker>
  </View>


  {/* Nouvelle section pour lecteur de codes à barres */}
<View style={{ marginTop: 20 }}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <MaterialCommunityIcons name="barcode-scan" size={24} color="green" style={{ marginRight: 8 }} />
    <Text style={{ fontSize: 16, color: '#333',fontWeight: 'bold', }}>Lecteur de codes à barres par défaut</Text>
  </View>

  <Picker
    selectedValue={scannerType}
    style={{ height: 50, width: 200, marginTop: 8 ,backgroundColor: '#f0f0f0',}}
    onValueChange={(itemValue) => setScannerType(itemValue)}
  >
    <Picker.Item label="Caméra" value="camera" />
    <Picker.Item label="Autre" value="autre" />
  </Picker>
</View>

 {/* Nouvelle section Impression */}
      <View style={styles.section}>
        <Text style={styles.sectionSubtitle}>Impression</Text>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Activer l'impression</Text>
          <Switch value={printingEnabled} onValueChange={setPrintingEnabled} />
        </View>
         {printingEnabled && (
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Format</Text>
            <Picker
              selectedValue={printFormat}
              style={styles.picker}
              onValueChange={(value) => setPrintFormat(value)}
            >
              <Picker.Item label="Ticket (80mm)" value="ticket" />
              <Picker.Item label="A4" value="a4" />
            </Picker>
<TouchableOpacity
  style={styles.myButton}
  onPress={() =>
    printColisDetails({
      numero: 'C123456789',
      client: 'Mohamed Ali',
      adresse: '123 Rue des Livraisons, Casablanca',
      telephone: '0600000000',
      montant: '150 MAD',
    })
  }
>
  <Text style={styles.myButtonText}>Imprimer le colis</Text>
</TouchableOpacity>

          </View>
        )}
      </View>




{/* Nouvelle section Information sur l'application */}
<View style={[styles.section, { marginTop: 30 }]}>
  <Text style={styles.sectionSubtitle}>Information sur l'application</Text>
  
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
  <MaterialCommunityIcons
    name="timer-outline"
    size={24}
    color="green"
    style={{ marginRight: 8,top:10 }}
  />
  <Text style={styles.sectionTitleText1}>Version de l'application </Text>
  <Text style={{ fontSize: 14, color: '#555', marginTop: 10,right:170,top: 30,fontWeight: 'bold', }}>1.0.0</Text>
</View>
</View>

<View style={[styles.section, { marginTop: 30 }]}>
  <View style={{ marginBottom: 8 }}>
    <Text style={styles.sectionSubtitle}>Paramètres de connexion</Text>

    {/* L'icône URL + texte URL juste en dessous */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
      <MaterialCommunityIcons
        name="web"
        size={20}
        color="green" 
        style={{ marginRight: 8 }}
      />
      <Text style={{ fontSize: 14, color: '#555' }}>L'URL Odoo</Text>
       <Text style={{ fontSize: 14, color: '#555', marginTop: 10,right:70,top: 30,fontWeight: 'bold', }}>https://www2.sapresslogistics.ma</Text>
    </View>
{/* L'icône base de données + texte */}
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
      <MaterialCommunityIcons
        name="database"
        size={20}
        color="green"
        style={{ marginRight: 8,top:30 }}
      />
      <Text style={{ fontSize: 14, color: '#555', top:30 }}> Base de données</Text>
    </View>
<Text style={{ fontSize: 14, color: '#555', fontWeight: 'bold', marginLeft: 28, marginTop: 4,top: 30, }}>
      SLM_PROD_27_7
    </Text>
  </View>
</View>

 <View style={[styles.section, { marginTop: 30 }]}>
      <View style={{ marginBottom: 8 }}>
        <Text style={styles.sectionSubtitle}>Déconnexion</Text>

        {/* Icône + texte déconnexion */}
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
          onPress={() => router.replace('../../screens/Login')}
        >
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color="green"
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 14, color: '#555' }}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>


</View>

          </View>
          </ScrollView>
        </SafeAreaView>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blurView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  customHeader: {
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 15,
    backgroundColor: 'rgb(110, 189, 72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  cameraCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgb(110, 189, 72)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    overflow: 'hidden',
   // right:1,
    top:1,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 30,
  },
  removeButton: {
    position: 'absolute',
    right: 180, // Ajuste selon la position
    top: 10,
    zIndex: 20,
    
  },
  title: {
    fontSize: 17,
    //fontWeight: '600',
    color: '#000',
    top:0,
    //right:20
    left:10,
  },
  title1: {
    fontSize: 17,
    //fontWeight: '600',
    color: '#000',
    //top:-50,
    left:30,
  },
   title2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
   // top:-50,
    left:1,
  },

  highlight: {
  color: 'rgb(35, 99, 5)', // ou une autre couleur que tu veux
  fontWeight: 'bold',
},

sectionTitleContainer: {
  backgroundColor: '#E0E0E0', // gris clair
  paddingVertical: 8,
  paddingHorizontal: 40,
  borderRadius: 8,
  marginTop: 10,
 // right:250,
  top:1,
  width: '100%', 
},
sectionTitleText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  right:20,
},
sectionTitleText1: {
  fontSize: 16,
  //fontWeight: 'bold',
  color: '#333',
  right:1,
  marginTop:20,
},
sectionTitleText2: {
  fontSize: 16,
   fontWeight: 'bold',
  color: '#333',
  right:1,
  marginTop:20,
},


iconPickerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  borderRadius: 5,
  marginTop: 10
},
icon: {
  paddingHorizontal: 10
},
picker: {
  flex: 1,
  height: 50
},

  section: { marginTop: 20, backgroundColor: '#f1f1f1', padding: 15, borderRadius: 8 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },

  sectionSubtitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, top:10},
  

  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  
  optionLabel: { fontSize: 14 },
  
 
  myButton: {
    backgroundColor: 'rgb(110, 189, 72)',  
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    // ombre (Android et iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  myButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },


 

});

export default Profile;
