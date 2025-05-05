import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // Fonction pour simuler une recherche
  const handleSearch = () => {
    console.log('Recherche en cours pour:', searchQuery);
    // Tu pourrais ici ajouter de la logique pour effectuer la recherche
  };

  useEffect(() => {
    const backAction = () => {
      router.push('/HomePage');
      return true; // empêche le comportement par défaut
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove(); // nettoyage à la sortie
  }, []);
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Titre de la page de recherche */}
        <Text style={styles.title}>Recherche</Text>

        {/* Champ de recherche */}
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        {/* Bouton de recherche */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Lancer la Recherche</Text>
        </TouchableOpacity>

        {/* Affichage des résultats de la recherche (Exemple statique) */}
        {searchQuery ? (
          <View style={styles.results}>
            <Text style={styles.resultsText}>Résultats pour "{searchQuery}":</Text>
            {/* Remplace ce texte par des résultats dynamiques */}
            <Text style={styles.resultsText}>Résultat 1</Text>
            <Text style={styles.resultsText}>Résultat 2</Text>
            <Text style={styles.resultsText}>Résultat 3</Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Menu en bas de la page */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={[styles.menuButton, pathname === '/HomePage' && styles.activeButton]}
          onPress={() => router.push('/HomePage')}
        >
          <Ionicons name="home" size={24} color={pathname === '/HomePage' ? '#007AFF' : 'black'} />
          <Text style={[styles.menuButtonText, pathname === '/HomePage' && styles.activeText]}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '/search' && styles.activeButton]}
          onPress={() => router.push('/search')}
        >
          <Ionicons name="search" size={24} color={pathname === '/search' ? '#007AFF' : 'black'} />
          <Text style={[styles.menuButtonText, pathname === '/search' && styles.activeText]}>Recherche</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '/historique' && styles.activeButton]}
          onPress={() => router.push('/historique')}
        >
          <Ionicons name="time" size={24} color={pathname === '/historique' ? '#007AFF' : 'black'} />
          <Text style={[styles.menuButtonText, pathname === '/historique' && styles.activeText]}>L'historique</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, pathname === '../login' && styles.activeButton]}
          onPress={() => router.replace('../login')}
        >
          <Ionicons name="arrow-back" size={24} color={pathname === '../login' ? '#007AFF' : 'black'} />
          <Text style={[styles.menuButtonText, pathname === '../login' && styles.activeText]}>Retour</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e40af',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  results: {
    marginTop: 20,
  },
  resultsText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
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
