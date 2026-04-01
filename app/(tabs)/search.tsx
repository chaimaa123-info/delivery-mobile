import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  ImageBackground,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTourStore } from '../../store/useTourStore';
import { useLogout } from '../logout';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  const colisList = useTourStore((state) => state.colis);

  // Filtrage dynamique selon la recherche
  const filteredResults = searchQuery
    ? colisList.filter(colis =>
        colis.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        colis.barcode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const backAction = () => {
      router.push('/HomePage');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    keyboardVerticalOffset={0}
  >
    <ImageBackground
        source={require('../../assets/images/TMS1.png')} 
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"
      >
        <BlurView intensity={200} tint="light" style={{ flex: 1 }}>

    <View style={styles.container}> 
      {/* Menu supérieur avec recherche */}
      <View style={styles.topMenu}>
        <TouchableOpacity onPress={logout}></TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="N° Colis"
            placeholderTextColor="grey"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={() => {}} style={styles.searchCircle}>
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

   <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: 900 }]}>

        {searchQuery ? (
          filteredResults.length > 0 ? (
            filteredResults.map((colis, index) => (
              <View key={index} style={styles.resultItem}>
                 <Text style={styles.resultsText}>
    <Text style={{ fontWeight: 'bold' }}>N° Colis : </Text>{colis.code}
  </Text>
  <Text style={styles.resultsText}>
    <Text style={{ fontWeight: 'bold' }}>N° Demande : </Text>{colis.demande}
  </Text>
  <Text style={styles.resultsText}>
    <Text style={{ fontWeight: 'bold' }}>Expéditeur : </Text>{colis.expediteur}
  </Text>
  <Text style={styles.resultsText}>
    <Text style={{ fontWeight: 'bold' }}>Destinataire : </Text>{colis.destinatairee}
  </Text>
  <Text style={styles.resultsText}>
    <Text style={{ fontWeight: 'bold' }}>Adresse : </Text>{colis.street}
  </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noResults}>Aucun résultat pour "{searchQuery}".</Text>
          )
        ) : null}
      </ScrollView>

      {/* Menu en bas de la page */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={[styles.menuButton, pathname === '/HomePage' && styles.activeButton]}
          onPress={() => router.push('/HomePage')}
        >
          <Ionicons name="home" size={24} color="white" />
          <Text style={[styles.menuButtonText, pathname === '/HomePage' && styles.activeText]}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '/search' && styles.activeButton]}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={24} color="white" />
          <Text style={[styles.menuButtonText, pathname === '/search' && styles.activeText]}>Recherche</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '/versement' && styles.activeButton]}
          onPress={() => router.push('/versement')}
        >
          <Ionicons name="cash-outline" size={24} color="white" />
          <Text style={[styles.menuButtonText, pathname === '/versement' && styles.activeText]}>Versement</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '../logout' && styles.activeButton]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={[styles.menuButtonText, pathname === '../logout' && styles.activeText]}>Retour</Text>
        </TouchableOpacity>
      </View>
    </View>
       </BlurView>
      </ImageBackground>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(110, 189, 72)',
    paddingTop: 50,
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 22,
    marginLeft: 5,
    height: 55,
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, color: 'black' },
  searchCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgb(110, 189, 72)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  scrollContainer: { flexGrow: 1, padding: 20 },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  resultsText: {
    fontSize: 16,
    color: '#333',
  },
  noResults: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  bottomMenu: {
     flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: 'rgb(110, 189, 72)',
  paddingVertical: 20,
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  // Optionnel : élévation pour rester au-dessus
  elevation: 10,
  zIndex: 10,
    
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
});
