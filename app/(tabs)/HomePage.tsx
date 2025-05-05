import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTourStore } from '../../store/useTourStore';
import { usePathname } from 'expo-router';
import { Alert } from 'react-native';

export default function HomePage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const colis = useTourStore((state) => state.colis);
  const historique = useTourStore((state) => state.historique);
  const setColis = useTourStore((state) => state.setColis);
  const setHistorique = useTourStore((state) => state.setHistorique);
  const [pinnedColis, setPinnedColis] = useState<string[]>([]);
  const pathname = usePathname();
  const [selectedColisIndex, setSelectedColisIndex] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const allColis = [...historique.flat(), ...colis];

  const supprimerColis = (index: number) => {
    if (index < historique.flat().length) {
      const flatHistorique = historique.flat();
      flatHistorique.splice(index, 1);
      setHistorique([flatHistorique]);
    } else {
      const adjustedIndex = index - historique.flat().length;
      const newColis = [...colis];
      newColis.splice(adjustedIndex, 1);
      setColis(newColis);
    }
  };

  return (
    <View style={styles.container}>
      {!isScanning && (
        <TouchableOpacity onPress={() => router.push('/ScanPage')} style={styles.startScanButton}>
          <View style={styles.squareTopLeft} />
          <View style={styles.squareTopRight} />
          <View style={styles.squareBottomLeft} />
          <View style={styles.squareBottomRight} />
          <Ionicons name="scan" size={30} color="white" />
        </TouchableOpacity>
      )}

      <View style={styles.historiqueContainer}>
        <Text style={styles.sectionTitle}>Historique des colis :</Text>
        {allColis.length > 0 ? (
          <ScrollView contentContainerStyle={styles.historiqueList}>
            {allColis.map((code, index) => (
              <TouchableOpacity
                key={index}
                onLongPress={() => {
                  setSelectedColisIndex(index);
                  setShowOptions(true);
                }}
              >
                  <View style={[
                  styles.colisBox,
                  pinnedColis.includes(code) && { backgroundColor: '#fff8dc' }
                ]}>
                  <Text style={styles.colisTitle}>
                    Colis {index + 1}
                    {pinnedColis.includes(code) && <Text> 📌</Text>}
                    :
                  </Text>
                  <Text style={styles.codeText}>{code}</Text>
    </View>
  </TouchableOpacity>
))}
          </ScrollView>
        ) : (
          <Text style={styles.codeItem}>Aucun colis scanné.</Text>
        )}
      </View>

      <Modal
  transparent
  visible={showOptions}
  animationType="slide"
  onRequestClose={() => setShowOptions(false)}
>
  <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
    <View style={styles.modalOverlay}>
      <View style={styles.bottomSheet}>
      <View style={styles.handleBar} />

        {selectedColisIndex !== null && (() => {
          const updatedAllColis = [...historique.flat(), ...colis];
          const colisCode = updatedAllColis[selectedColisIndex];
          const isPinned = pinnedColis.includes(colisCode);

          return (
            <>
              <Text style={styles.modalColisTitle}>
                📦 Colis sélectionné : {colisCode}
              </Text>

              {/* Épingler / Désépingler */}
              <TouchableOpacity
                onPress={() => {
                  if (isPinned) {
                    setPinnedColis((prev) => prev.filter((c) => c !== colisCode));
                  } else {
                    updatedAllColis.splice(selectedColisIndex, 1);
                    updatedAllColis.unshift(colisCode);
                    setColis(updatedAllColis);
                    setHistorique([]);
                    setPinnedColis((prev) => [...new Set([colisCode, ...prev])]);
                  }
                  setShowOptions(false);
                }}
              >
                <Text style={styles.sheetOption}>
                  {isPinned ? '❌ Désépingler' : '📌 Épingler'}
                </Text>
              </TouchableOpacity>

              {/* Supprimer */}
              <TouchableOpacity
  onPress={() => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce colis ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            supprimerColis(selectedColisIndex);
            setShowOptions(false);
          },
        },
      ],
      { cancelable: true }
    );
  }}
>
  <Text style={styles.sheetOption}>🗑️ Supprimer</Text>
</TouchableOpacity>

            </>
          );
        })()}
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>

 {/* Menu en bas de page */}

<View style={styles.bottomMenu}>
  <TouchableOpacity
    style={[
      styles.menuButton,
      pathname === '/HomePage' && styles.activeButton,
    ]}
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
    style={[
      styles.menuButton,
      pathname === '/search' && styles.activeButton,
    ]}
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
    style={[
      styles.menuButton,
      pathname === '/historique' && styles.activeButton,
    ]}
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
    style={[
      styles.menuButton,
      pathname === '../login' && styles.activeButton,
    ]}
    onPress={() => router.replace('../login')}
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
    backgroundColor: '#fff',
    paddingTop: 20,
    position: 'relative',
  },
  startScanButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 60,
    height: 60,
    //backgroundColor: '#007AFF',
    backgroundColor: 'rgb(86, 173, 234)',
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
    top: 22,
    left: 23,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareTopRight: {
    position: 'absolute',
    top: 22,
    right: 23,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareBottomLeft: {
    position: 'absolute',
    bottom: 22,
    left: 23,
    width: 5,
    height: 5,
    backgroundColor: 'white',
  },
  squareBottomRight: {
    position: 'absolute',
    bottom: 22,
    right: 23,
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
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sheetOption: {
    fontSize: 18,
    paddingVertical: 39,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },

  modalColisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    //textAlign: 'center',
    marginBottom: 15,
    color: '#333',
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
    //backgroundColor: '#f1f1f1',
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
