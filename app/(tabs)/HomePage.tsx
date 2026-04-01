//HomePage
import type { Colis } from '@/store/useTourStore';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ColisBox from '../../components/ColisBox';
import { useTourStore } from '../../store/useTourStore';
import { useLogout } from '../logout';


export default function HomePage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const colis = useTourStore((state) => state.colis);
  const historique = useTourStore((state) => state.historique);
  const setColis = useTourStore((state) => state.setColis);
  const setHistorique = useTourStore((state) => state.setHistorique);
  const pathname = usePathname();
  const [selectedColisIndex, setSelectedColisIndex] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  
  const logout = useLogout();
  
  //const allColis = [...historique.flat(), ...colis];

  const colisList = useTourStore((state) => state.colis);
  console.log('colisList:', colisList);
  const setMapAddresses = useTourStore((state) => state.setMapAddresses);
 const [showMenu, setShowMenu] = useState(false);
  

  const handleOptionPress = (option: 'map' | 'profile') => {
    setShowMenu(false);
    if (option === 'map') {
      // Récupérer toutes les adresses des colis scannés (street)
      const addresses = colis
        .map((c) => c.street)
        .filter((street) => street && street.length > 0);
      setMapAddresses(addresses);
      router.push('/map'); // Naviguer vers la page carte
    } else if (option === 'profile') {
      router.push('/profile');
    }
  };

  
  
  return (

      <ImageBackground
    source={require('../../assets/images/TMS1.png')} 
    style={{ flex: 1, width: '100%', height: '100%' }}
    resizeMode="cover"
  >
    <BlurView intensity={200} tint="light" style={{ flex: 1 }}>
      
      <SafeAreaView style={styles.container}
>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    <SafeAreaView style={styles.container}>
      {/* StatusBar */}
      <StatusBar barStyle="light-content" backgroundColor="rgb(110, 189, 72)" />

      {/* Menu supérieur avec le bouton de scan */}
      <View style={styles.topMenu}>
        <TouchableOpacity
          onPress={() => router.push('/ScanPage')}
          style={styles.scanButton}
        >
          <View style={styles.squareTopLeft} />
          <View style={styles.squareTopRight} />
          <View style={styles.squareBottomLeft} />
          <View style={styles.squareBottomRight} />
          <Ionicons name="scan" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique des Colis</Text>
        
         <TouchableOpacity onPress={() => setShowMenu(!showMenu)}  style={styles.menuButton}>
    <Ionicons name="ellipsis-vertical" size={25} color="white" />
  </TouchableOpacity>
      </View>

{/* Menu déroulant */}
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleOptionPress('map')}>
            <Ionicons name="map-outline" size={20} color="black" style={styles.icon} />
            <Text style={styles.menuText}>Voir la carte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleOptionPress('profile')}>
            <Ionicons name="person-outline" size={20} color="black" style={styles.icon} />
            <Text style={styles.menuText}>Mon profil</Text>
          </TouchableOpacity>
        </View>
      )}


      <View style={styles.historiqueContainer}>
        <Text style={styles.infoText}>
  N° Expédition : <Text style={{ fontWeight: 'bold' }}>BATCH/60671</Text>
</Text>

        <Text style={styles.infoText}>
  Nbr de colis à livrer : <Text style={{ fontWeight: 'bold' }}> {colisList.length}</Text>
 
</Text>


       {colisList.length > 0 ? (
  <ScrollView contentContainerStyle={styles.historiqueList}>
    {colisList.map((colis: Colis, index: number) => {
      // Choix de la clé unique : id, sinon code, sinon index
      const uniqueId = colis.id ?? colis.code ?? index;
      const idStr = uniqueId != null ? uniqueId.toString() : '';

      return (
        <TouchableOpacity
          key={idStr}
          onPress={() => {
            if (idStr) {
              router.push({
                pathname: '/details',
                params: { id: idStr },
              });
            } else {
              console.warn('ID manquant pour la navigation', colis);
            }
          }}
        >
          <ColisBox colis={colis} />
        </TouchableOpacity>
      );
    })}
  </ScrollView>
) : (
  <Text style={styles.codeItem}>Aucun colis scanné.</Text>
)}

      </View>

      

     

      {/* Menu en bas de page */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={[styles.menuButton, pathname === '/HomePage' && styles.activeButton]}
          onPress={() => router.push('/HomePage')}
        >
          <Ionicons
            name="home" 
            size={24} 
            color={pathname === '/HomePage' ? 'white' : 'white'} 
          />
          <Text style={[styles.menuButtonText, pathname === '/HomePage' && styles.activeText]}>
            Accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '/search' && styles.activeButton]}
          onPress={() => router.push('/search')}
        >   
          <Ionicons name="search" size={24} color={pathname === '/search' ? 'white' : 'white'} />
          <Text style={[styles.menuButtonText, pathname === '/search' && styles.activeText]}>
            Recherche
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '/versement' && styles.activeButton]}
          onPress={() => router.push('/versement')}
        >
          <Ionicons name="cash-outline" size={24} color={pathname === '/versement' ? 'white' : 'white'} />
          <Text style={[styles.menuButtonText, pathname === '/versement' && styles.activeText]}>
            Versement
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '../logout' && styles.activeButton]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color={pathname === '../logout' ? 'white' : 'white'} />
          <Text style={[styles.menuButtonText, pathname === '../logout' && styles.activeText]}>
            Retour
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </SafeAreaView>
      </BlurView>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
   paddingTop: 10,
    position: 'relative',
  },
  startScanButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'rgb(3, 107, 21)',
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
    top: 17,
    left: 17,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareTopRight: {
    position: 'absolute',
    top: 17,
    right: 17,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareBottomLeft: {
    position: 'absolute',
    bottom: 17,
    left: 17,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareBottomRight: {
    position: 'absolute',
    bottom: 17,
    right: 17,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  historiqueContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  historiqueList: {
    paddingBottom: 30,
  },
  colisBox: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  colisTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  codeText: {
    fontSize: 16,
    color: '#000',
  },
  codeItem: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'dark',
  },
  
  
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgb(110, 189, 72)',
    paddingVertical: 20,
    
  },
  menuButton: {
    alignItems: 'center',
    top:-10,

  },
  menuButtonText: { 
    fontSize: 12,
    color: 'white',
  },

  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  
  activeText: {
    fontWeight: 'bold',
    color: 'white',
  },
  
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    top:-80,
    
  },
  

  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: 'rgb(110, 189, 72)',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  
  scanButton: {
    backgroundColor: 'green',
    borderRadius: 30,
    padding: 10,
  },
  
  
  
  eyeButton: {
    position: 'absolute',
    bottom: 100, 
    right: 20,
    backgroundColor: 'rgb(110, 189, 72)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

 
  listContainer: {
    padding: 20,
  },
  noColisText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },



  menu: {
    position: 'absolute',
    top: 50, // ajuste selon ta hauteur de header
    right: 15,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 5, // ombre android
    shadowColor: '#000', // ombre ios
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
    width: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },

}); 