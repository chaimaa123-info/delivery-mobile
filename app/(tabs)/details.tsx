import { useTourStore } from '@/store/useTourStore';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import type { Colis } from '@/store/useTourStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { Image, ImageBackground, Linking } from 'react-native';
import ImageView from "react-native-image-viewing";





export default function Dashboard() {
  const router = useRouter();
  const { id, rescannedCode } = useLocalSearchParams<{ rescannedCode?: string; id?: string }>();

  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'details' | 'payment' | 'documents' | 'autre'>('details');
  const [isRefused, setIsRefused] = useState(false);
  const [isReported, setIsReported] = useState(false);

 
//const rescanned = useTourStore(state => state.rescannedCode);
const params = useLocalSearchParams<{ rescannedCode?: string; id?: string }>();
//const [rescanned, setRescanned] = useState<string | undefined>(params.rescannedCode);
const rescannedCodes = useTourStore(state => state.rescannedCodes);
const setRescannedCode = useTourStore(state => state.setRescannedCode);

// Nettoyage uniquement pour ce colis
useEffect(() => {
  return () => {
    if (id) setRescannedCode(id, null);
  };
}, [id]);



 //const { id } = useLocalSearchParams();
 console.log('id param:', id);

 const colisList = useTourStore((state) => state.colis);
 const colis = colisList.find(c => c.code?.toString() === id) ?? null;
 console.log('Liste des colis:', colisList);

  const [refusComment, setRefusComment] = useState('');
  const [reportComment, setReportComment] = useState('');
  useEffect(() => {
    // Remet le commentaire à vide (ou 'Commentaire') à chaque fois que le composant est monté
    setRefusComment('');
  }, []);
  

const [showReasonsModal, setShowReasonsModal] = useState<'refus' | 'report' | false>(false);

  const reasonsList = [
  'Client absent',
  'Refus de livraison',
  'Colis endommagé',
  'Commande annulée',
  'Commande erronée',
  'Refus de paiement',
  'Client injoignable',
  'Numéro de GSM invalide',
  'Repport par le livreur',
  'Repport par le client',
  'Réglement non préparé',
  'Colis perdu', 
  'Colis ouvert ou reconditionné', 
  'Ville erronée', 
  'Autre',
];


  const logout = () => {
    router.push('../logout');
  };



const openMaps = (street: string) => {
  if (!street) {
    Alert.alert('Adresse invalide', 'Aucune adresse disponible pour la localisation.');
    return;
  }

  const query = encodeURIComponent(street);
  const url = Platform.select({
    ios: `maps:0,0?q=${query}`,
    android: `geo:0,0?q=${query}`,
  });

  if (url) {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback Google Maps web
          const browser_url = `https://www.google.com/maps/search/?api=1&query=${query}`;
          Linking.openURL(browser_url);
        }
      })
      .catch(() => {
        Alert.alert('Erreur', 'Impossible d\'ouvrir la localisation.');
      });
  }
};


const [commentaire, setCommentaire] = useState('');
const [imageUri, setImageUri] = useState<string | null>(null);
const [images, setImages] = React.useState<string[]>([]);


const [visible, setVisible] = useState(false);
const [currentImageIndex, setCurrentImageIndex] = useState(0);

  
  // Prépare le tableau attendu par ImageViewing
const imageObjects = images.map(uri => ({ uri }));

const openCamera = async () => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert("Permission refusée pour accéder à la caméra");
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.5,
  });

  if (!result.canceled && result.assets.length > 0) {
    setImageUri(result.assets[0].uri); // ✅ mise à jour de l'image
  }
};

  const updateStatutColis = useTourStore(state => state.updateStatutColis);
  const addToHistorique = useTourStore(state => state.addToHistorique);

  const removeColis = useTourStore(state => state.removeColis);
  
const updatedColis: Colis = {
  ...colis,
  statutLivraison: 'livré',
} as Colis;


  


  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
         if (!colis) return <Text>Aucun colis sélectionné</Text>;
        return (
          
   

          <View>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={30} color="black" />
              <Text style={styles.detailText}>
                 Client
                  <Text style={{ fontWeight: 'bold' }}>:   {colis.expediteur}</Text>
                 </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={30} color="green" />
              <Text style={styles.detailText}>
                N° Téléphone 
                 <Text style={{ fontWeight: 'bold' }}>:    {colis.mobile} </Text>
                </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="receipt-outline" size={30} color="black" />
              <Text style={styles.detailText}>
                N° Demande
                 <Text style={{ fontWeight: 'bold' }}>:   {colis.demande} </Text>
                </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="pricetag-outline" size={30} color="black" />
              <Text style={styles.detailText}>
                Réf :
                <Text style={{ fontWeight: 'bold' }}>   WH/OUT/1288564</Text>
                </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={30} color="black" />
              <Text style={styles.detailText}>
               Montant retourne 
               <Text style={{ fontWeight: 'bold' }}>  :  {colis.montant_retourne} DHs  </Text>
               </Text>
            </View>

           <View style={styles.detailRow}>
         <Ionicons name="location-outline" size={30} color="black" />
        <Text style={styles.detailText}>
          Adresse 
          <Text style={{ fontWeight: 'bold' }}>  :  {colis.street} </Text>
          </Text>
          
         
        </View>

      < TouchableOpacity
      style={styles.mapButton}
      onPress={() => openMaps(colis.street)}
>
  <MaterialCommunityIcons name="map-marker-radius" size={30} color="green"  style={styles.mapIconOverlay}/>
  <Text style={[styles.mapButtonText, { textDecorationLine: 'underline' }]}>
  Voir sur la carte
</Text>

</TouchableOpacity>






 <TouchableOpacity
  style={styles.scanBox}
  onPress={() => router.push(`/ScanPage?mode=rescanner&id=${id}`)}
>
  <Text style={styles.scanBoxText}>
    {rescannedCodes[id!] ? `Colis rescanné : ${rescannedCodes[id!]}` : 'Scanner un colis'}
  </Text>
  <MaterialCommunityIcons
    name="camera"
    size={28}
    color="white"
    style={styles.scanIcon}
  />
</TouchableOpacity>
            






<View style={styles.checkboxGroup}>
  {/* Bouton Refus */}
 {!isReported && (
  <TouchableOpacity      
    onPress={() => {
      setIsRefused(!isRefused);
      if (!isRefused) 
        setIsReported(false);
      setReportComment('');
    }}
    style={styles.checkboxRow}
  >
    <Text style={styles.checkboxIcon}>{isRefused ? '✅' : '⬜'}</Text>
    <Text style={styles.checkboxText2}> Refus</Text>
  </TouchableOpacity>
)}


  {/* Bouton Report (uniquement si Refus n’est pas actif) */}
  {!isRefused && (
    <TouchableOpacity
      onPress={() => {
        setIsReported(!isReported);
        if (!isReported) 
          setIsRefused(false);
        setRefusComment('');
      }}
      style={styles.checkboxRow}
    >
      <Text style={styles.checkboxIcon}>{isReported ? '✅' : '⬜'}</Text>
      <Text style={styles.checkboxText1}> Report</Text>
    </TouchableOpacity>
  )}

  {/* Champ commentaire si Refus */}
  {isRefused && (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontSize: 16, marginBottom: 6 }}>Commentaire :</Text>
      <TouchableOpacity
        onPress={() => setShowReasonsModal('refus')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Text style={{ fontSize: 16, color: '#333', flex: 1 }}>
          {refusComment || 'Commentaire'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  )}

  {/* Champ commentaire si Report */}
  {isReported && (
    <View style={{ marginTop: 10 }}>
      <Text style={{ fontSize: 16, marginBottom: 6 }}>Commentaire :</Text>
      <TouchableOpacity
        onPress={() => setShowReasonsModal('report')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Text style={{ fontSize: 16, color: '#333', flex: 1 }}>
          {reportComment || 'Commentaire'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  )}


  {/* Bouton final */}
 <TouchableOpacity
  style={{
    marginTop: (isRefused || isReported) ? 6 : 20,
    backgroundColor: isRefused 
      ? 'rgb(200, 9, 9)'
      : isReported 
        ? 'orange'
      : '#6EBD48',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  }}
  onPress={() => {
    if (isRefused) {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir refuser ce colis ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Oui, refuser",
            style: "destructive",
            onPress: () => {
              console.log('Colis refusé :', refusComment);
              updateStatutColis(colis.barcode, 'refusé'); // ✅ à TOUJOURS appeler ici
              router.back(); // ✅ retourne à la page d'accueil
            }
          }
        ]
      );
    } else if (isReported) {
      Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir reporter ce colis ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, reporter",
          onPress: () => {
          updateStatutColis(colis.barcode, 'reporté'); // ✅ Changement réel dans Zustand
          console.log('Colis reporté avec motif :', reportComment);
           router.back(); // ✅ retourne à la page d'accueil
            
          },
        },
      ]
    );
    } else {
    Alert.alert(
      "Confirmation",
      "Confirmez-vous la livraison de ce colis ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, livrer",
          onPress: () => {
            console.log('Colis livré');
          },
        },
      ]
    );
  }
}}
>
  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
    {isRefused ? 'REFUSER' : isReported ? 'REPORTER' : 'LIVRER'}
  </Text>
</TouchableOpacity>
</View>



<Modal
  visible={!!showReasonsModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowReasonsModal(false)}
>
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '70%' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Sélectionnez un commentaire ({showReasonsModal}) :
      </Text>

      <ScrollView>
        {reasonsList.map((reason, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (showReasonsModal === 'refus') {
                setRefusComment(reason);
              } else {
                setReportComment(reason);
              }
              setShowReasonsModal(false);
            }}
            style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
          >
            <Text style={{ fontSize: 16 }}>{reason}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setShowReasonsModal(false)}
        style={{ marginTop: 20, alignSelf: 'flex-end', padding: 10 }}
      >
        <Text style={{ color: 'green', fontSize: 16 }}>Annuler</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


     </View>
     
         );

      case 'payment':
        if (!colis) {
    return null; // ou un message d'erreur, ou un loader
  }
        return (
          
          <View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={30} color="black" />
             <Text style={styles.detailText}>
            Montant retourne 
              <Text style={{ fontWeight: 'bold' }}>:  {colis.montant_retourne} DHs</Text>
            </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="card-outline" size={30} color="black" />
              <Text style={styles.detailText}>
                Mode de règlement 
                 <Text style={{ fontWeight: 'bold' }}>:  {colis.methode_retour_fond} </Text>
                </Text>
            </View>
            {/* Bouton Valider le paiement */}
      <TouchableOpacity
       style={styles.validateButton}
  onPress={() => {
    Alert.alert('Confirmation', 'Le paiement est validé');
  }}
>
        <Text style={styles.validateButtonText}>Valider le paiement</Text>
      </TouchableOpacity>
          </View>
          
        );


        
     case 'documents':
        if (!colis) return <Text>Aucun colis sélectionné</Text>;
  return (


    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
      <Text style={[styles.headerTitle,{ textDecorationLine: 'underline' }]}>Liste des documents à retourner</Text>
      <View>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={30} color="black" />
          <Text style={styles.detailText}>
            Client : 
            <Text style={{ fontWeight: 'bold' }}>   {colis.expediteur}</Text>
            </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="cube-outline" size={30} color="black" />
          <Text style={styles.detailText}>
            Nombre de colis :
            <Text style={{ fontWeight: 'bold' }}>  1 </Text>
            </Text>
        </View>

        
        <View style={styles.detailRow}>
          <Ionicons name="pricetag-outline" size={30} color="black" />
          <Text style={styles.detailText}>
            Colis N° : 
             <Text style={{ fontWeight: 'bold' }}>    {colis.code} </Text>
            </Text>
        </View>

 {/* Rectangle caméra */}
      <View style={styles.cameraContainer}>
        <TouchableOpacity onPress={openCamera} style={styles.cameraButton}>
          <Ionicons name="camera-outline" size={30} color="green" />
        </TouchableOpacity>
         
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.cameraText}>Bon de livraison (Digitale)</Text>
        )}
      </View>

      {/* Miniatures */}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {images.map((uri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setCurrentImageIndex(index);
              setVisible(true);
            }}
          >
            <Image
              source={{ uri }}
              style={{ width: 100, height: 120, marginRight: 10, borderRadius: 8 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Viewer plein écran avec zoom */}
      <ImageView
  images={images.map(uri => ({ uri }))}
  imageIndex={currentImageIndex}
  visible={visible}
  onRequestClose={() => setVisible(false)}
/>




  <Text style={styles.commentLabel}>Commentaire :</Text>

{/* Champ de saisie commentaire */}
  <TextInput
    style={styles.commentInput}
    placeholder="Saisir un commentaire..."
    value={commentaire}
    onChangeText={text => setCommentaire(text)}
    multiline
    numberOfLines={4}
  />


<TouchableOpacity
  onPress={openCamera}
  style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}
>
  <Ionicons name="camera-outline" size={30} color="green" style={{ marginRight: 8 }} />
  <Text style={{ fontSize: 17, color: 'green' }}>Scanner un autre document</Text>
</TouchableOpacity>


      </View>

 {/* Boutons alignés */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30}}>



  {/* BOUTON VALIDER  */}
  <TouchableOpacity
    onPress={() =>
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de valider la livraison ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Valider",
             onPress: () => {
         updateStatutColis(colis.code, 'livré'); // ✅ Met à jour le statut d’abord
         
       addToHistorique(updatedColis);  // ✅ Ajoute au tableau historique
        removeColis(colis.code); // ✅ Supprime de la tournée active

          Alert.alert("Livraison validée !");
          
          router.push('/HomePage');       // Retour à la homepage (adapte la route si besoin)
           
        },
            style: "destructive",
          },
        ],
        { cancelable: true }
      )

      
    }
    activeOpacity={0.8}
    style={{
      backgroundColor: '#6EBD48',
      alignSelf: 'flex-start',
      right :-18,
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      //top:260,
    }}
  >
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
      VALIDER LA LIVRAISON
    </Text>
  </TouchableOpacity>
    </View>
    
     </View>
  );


      case 'autre':
        return <Text>Autres informations</Text>;

      default:
        return null;
    }
  };

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (  

    <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
    <ImageBackground
    source={require('../../assets/images/TMS1.png')} 
    style={{ flex: 1 }}
    resizeMode="cover"
  >
    <BlurView intensity={200} tint="light" style={{ flex: 1 }}>

    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Détails</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('details')} style={styles.tabButton}>
          <Ionicons name="cube-outline" size={30} color={activeTab === 'details' ? '#90EE90' : 'white'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('payment')} style={styles.tabButton}>
          <Ionicons name="card-outline" size={30} color={activeTab === 'payment' ? '#90EE90' : 'white'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('documents')} style={styles.tabButton}>
          <Ionicons name="document-outline" size={30} color={activeTab === 'documents' ? '#90EE90' : 'white'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('autre')} style={styles.tabButton}>
          <Ionicons name="information-circle-outline" size={30} color={activeTab === 'autre' ? '#90EE90' : 'white'} />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      {/* Bottom menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={[styles.menuButton, pathname === '/details' && styles.activeButton]} onPress={() => router.push('/details')}>
          <Ionicons name="home" size={24} color="white" />
          <Text style={styles.menuButtonText}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/search')}>
          <Ionicons name="search" size={24} color="white" />
          <Text style={styles.menuButtonText}>Recherche</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/versement')}>
          <Ionicons name="cash-outline" size={24} color="white" />
          <Text style={styles.menuButtonText}>Versement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={logout}>
          <Ionicons name="log-out" size={24} color="white" />
          <Text style={styles.menuButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </View>
    </BlurView>
   </ImageBackground>
   </KeyboardAvoidingView>
  );
  
}
const styles = StyleSheet.create({
  container: { flex: 1 ,
    position: 'relative',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(110, 189, 72)',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    paddingHorizontal: 18,
    paddingBottom: 15,
  },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#444444',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: { padding: 5 },
  content: { flex: 1, padding: 20 },

  bottomMenu: {
   // position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgb(110, 189, 72)',
    paddingVertical: 20,
    
  },

  menuButton: { alignItems: 'center', top:-10,},
  menuButtonText: { fontSize: 12, color: 'white' },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    top:10,
    
  },

  detailText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
    //top:30,
  },
 


  checkboxGroup: {
  marginTop: 25,
  fontWeight: 'bold',
   
},

checkboxRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},

checkboxIcon: {
  fontSize: 18,
},

checkboxText1: {
  fontSize: 18,
  color: 'orange',
  marginLeft: 6,
  fontWeight: 'bold',
},

checkboxText2: {
  fontSize: 18,
  color: 'red',
  marginLeft: 6,
  fontWeight: 'bold',
},

activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  
 startScanButton: {
    position: 'absolute',
    //top: 255,
    left: 300,
    width: 60,
    height: 60,
    alignSelf: 'flex-start',
    backgroundColor: '#444444',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  squareTopLeft: {
    position: 'absolute',
    top: 23,
    left: 23,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareTopRight: {
    position: 'absolute',
    top: 23,
    right: 23,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareBottomLeft: {
    position: 'absolute',
    bottom: 23,
    left: 23,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareBottomRight: {
    position: 'absolute',
    bottom: 23,
    right: 23,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },  


 mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    top:7,
  },
  mapButtonText: {
    color: 'red',
    marginRight: 6,
    fontSize: 16,
     left:200,
     fontWeight: 'bold',
  },

underlineText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold', // optionnel pour plus de visibilité
  },

   validateButton: {
    marginTop: 400,
    backgroundColor: '#6EBD48', // vert, adapte selon ta charte
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  validateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  headerTitle: {
    fontSize: 20,
    //fontWeight: 'bold',
    color: 'black',
    
  },
  
cameraContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: 3,
  borderColor: '#ccc',
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
  backgroundColor: '#f9f9f9',
  top:30,
},

cameraText: {
  fontSize: 16,
  color: '#333',
  right:90,
},

commentInput: {
  marginTop:60,
  borderWidth: 2,
  borderColor: '#ccc',
  borderRadius: 10,
  padding: 10,
  fontSize: 16,
  backgroundColor: 'white',
  textAlignVertical: 'top', // pour Android, pour que le texte commence en haut
  minHeight: 80,
},

commentLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 6,
  color: '#333',
  top:60,
},

cameraButton: {
  marginRight: 10,
},



previewImage: {
  width: 100,
  height: 70,
  borderRadius: 8,
},

mapIconOverlay: {
  position: 'absolute',
  left: 330,     // position horizontale de l’icône par rapport au bouton
  top: '50%',   // position verticale au milieu du bouton
  transform: [{ translateY: -15 }], // pour centrer verticalement selon la taille de l’icône (30/2=15)
  zIndex: 10,   // pour être sûr que l’icône est au-dessus du texte
  opacity: 0.8, // optionnel, pour un peu de transparence
},

scanBox: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'grey', // vert doux
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 12,
  marginTop: 20,
  marginHorizontal: 10,
  elevation: 3, // pour un effet d'ombre léger sur Android
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
},
scanBoxText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'white',
},
scanIcon: {
  marginLeft: 10,
},

});