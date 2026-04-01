import { useTourStore } from '@/store/useTourStore';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Checkbox from 'expo-checkbox';
import { usePathname, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLogout } from '../logout';

const Versement = () => {
  // On récupère l'historique complet (tableau de tournées)
  const historique = useTourStore(state => state.historique);

  // On "aplati" l'historique pour avoir tous les colis livrés dans un tableau à plat
  const colisLivres = useMemo(() => {
    return historique.filter(c => c && c.code !== undefined && c.statutLivraison === 'livré');
  }, [historique]);

  console.log('Historique :', historique);

  // état des colis sélectionnés (par id)
  const [selectedCode, setSelectedCode] = useState<string[]>([]);

  const toggleSelection = (code: string) => {
    setSelectedCode(prev =>
      prev.includes(code) ? prev.filter(i => i !== code) : [...prev, code]
    );
  };

  const pathname = usePathname();
    const router = useRouter();
     const logout = useLogout();

  // Calcul total des montants retournés sur les colis sélectionnés
  const totalMontant = useMemo(() => {
    return colisLivres
      .filter(colis => selectedCode.includes(colis.code))
      .reduce((sum, colis) => sum + parseFloat(colis.montant_retourne || '0'), 0);
  }, [selectedCode, colisLivres]);

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
          />
          <SafeAreaView style={styles.container}>
          {/* Barre de titre personnalisée */}
          <View style={styles.statusBarTitle}>
            <Text style={styles.title}>Liste des colis livrés</Text>
          </View>

          <View style={{ flex: 1, paddingTop: 20 , paddingBottom: 80}}>

            <FlatList
              data={colisLivres}
              keyExtractor={item => item.code.toString()}
              renderItem={({ item }) => (
                <View style={styles.colisItem}>
                  <Checkbox
                    value={selectedCode.includes(item.code)}
                    onValueChange={() => toggleSelection(item.code)}
                  />
                  <View style={styles.colisBox}>
                    <Text style={styles.text}>
                      N° Colis : <Text style={{ fontWeight: 'bold' }}>{item.code}</Text>
                    </Text>
                    <Text style={styles.text}>
                      Client : <Text style={{ fontWeight: 'bold' }}>{item.expediteur}</Text>
                    </Text>
                      <Text style={styles.text}>
                      Destinataire : <Text style={{ fontWeight: 'bold' }}>{item.destinatairee}</Text>
                    </Text>
                    <Text style={styles.text}>
                      Montant à retourner: <Text style={{ fontWeight: 'bold' }}>{item.montant_retourne} Dhs</Text>
                    </Text>
                  </View>
                </View>
              )}
            />
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total à verser: {totalMontant.toFixed(2)} Dhs</Text>
            </View>
          </View>

          {/* 👇 Menu à la fin du SafeAreaView */}
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
        </SafeAreaView>
        </SafeAreaView>
      </BlurView>
    </ImageBackground>
  );
};

export default Versement;

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
    padding: 0,
     paddingTop: 10,
    position: 'relative',

  },

  statusBarTitle: {
    backgroundColor: 'rgb(110, 189, 72)', // même couleur que la status bar
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',  
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff',top:-9 },
  colisItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10,left:10 },
  colisInfo: { marginLeft: 10 },
  text: { fontSize: 16 },
  totalContainer: { marginTop: 20, paddingVertical: 12, borderTopWidth: 3, borderColor: '#ccc',padding:12 },
  totalText: { fontSize: 18, fontWeight: 'bold' },

  colisBox: {
  backgroundColor: 'rgba(25, 73, 2, 0.2)', // vert clair transparent
  padding: 10,
  borderRadius: 10,
  marginLeft: 15,
  flex: 1,
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
