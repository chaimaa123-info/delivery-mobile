import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Colis = {
  id: number;
  barcode: string;
  telephone: string;
  adresse: string;
  type_envoi: string;
  etape: string;
  statut: string;
  montant_livraison: string;
  montant_retourne: string;
  poids: string;
  expediteur: string;
  destinatairee: string;
  street:string;
   statutLivraison?: string;
};

type ColisBoxProps = {
  colis: Colis;
};


export default function ColisBox({ colis }: ColisBoxProps) {
  // Couleur de fond selon le statut
  let backgroundColor = '#fff8dc'; // par défaut

  if (colis.statutLivraison === 'refusé') {
    backgroundColor = '#FFCCCC'; // rouge clair
  } else if (colis.statutLivraison === 'reporté') {
    backgroundColor = '#FFD580'; // jaune clair
  }
   
  return (
    <View style={[styles.colisBox, { backgroundColor }]}>
      <Text style={styles.info}>Client : {colis.expediteur}</Text>
      <Text style={styles.info}>Adresse : {colis.street}</Text>
      <Text style={styles.info}>Étape : {colis.etape}</Text>
      <Text style={styles.info}>Poids : {colis.poids}Kg</Text>
      <Text style={styles.info}>Destinataire : {colis.destinatairee}</Text>
    </View> 
  );
}

const styles = StyleSheet.create({
  colisBox: {
    //backgroundColor: '#fff8dc',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
  },
});
