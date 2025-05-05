import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router'; // Si tu utilises Next.js pour la navigation
import React, { useEffect } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function HistoriqueScreen() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const backAction = () => {
      router.push('/HomePage');
      return true; // empêche le comportement par défaut
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove(); // nettoyage à la sortie
  }, []);
  

  return (
    <View style={styles.container}> {/* Vue principale */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Historique des Tournées</Text>

        <View style={styles.item}>
          <Text style={styles.text}>Tournée du 1er Mai 2025 - 10 colis</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.text}>Tournée du 2 Mai 2025 - 8 colis</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.text}>Tournée du 3 Mai 2025 - 12 colis</Text>
        </View>
      </ScrollView>

      
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={[styles.menuButton, pathname === '/HomePage' && styles.activeButton]}
          onPress={() => router.push('/HomePage')}
        >
          <Ionicons 
            name="home"
            size={24}
            color={pathname === '/HomePage' ? '#007AFF' : 'black'}
          />
          <Text style={[styles.menuButtonText, pathname === '/HomePage' && styles.activeText]}>
            Accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '/search' && styles.activeButton]}
          onPress={() => router.push('/search')}
        >
          <Ionicons
            name="search"
            size={24}
            color={pathname === '/search' ? '#007AFF' : 'black'}
          />
          <Text style={[styles.menuButtonText, pathname === '/search' && styles.activeText]}>
            Recherche
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '/historique' && styles.activeButton]}
          onPress={() => router.push('/historique')}
        >
          <Ionicons
            name="time"
            size={24}
            color={pathname === '/historique' ? '#007AFF' : 'black'}
          />
          <Text style={[styles.menuButtonText, pathname === '/historique' && styles.activeText]}>
            L'historique
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '../login' && styles.activeButton]}
          onPress={() =>router.replace('../login')}  
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={pathname === '../login' ? '#007AFF' : 'black'}
          />
          <Text style={[styles.menuButtonText, pathname === '../login' && styles.activeText]}>
            Retour
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#f9fafb', 
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#1e40af',
  },
  item: {
    backgroundColor: '#e0e7ff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: '#1e3a8a',
  },

  // Style pour le menu en bas de la page
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgb(86, 173, 234)',
    paddingVertical: 10,
  },
  menuButton: {
    alignItems: 'center',
  },
  menuButtonText: { 
    fontSize: 12,
    color: '#333',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  activeText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
});
