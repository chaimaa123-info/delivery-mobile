import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTourStore } from '../../store/useTourStore';

interface Coord {
  latitude: number;
  longitude: number;
  street: string;
}

export default function MapPage() {
  const colis = useTourStore((state) => state.colis); // Liste complète des colis
  const setMapAddresses = useTourStore((state) => state.setMapAddresses);
  const addresses = useTourStore((state) => state.mapAddresses); // tableau d’adresses

  const [coords, setCoords] = useState<Coord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  // Synchroniser mapAddresses à partir des colis à chaque changement de colis
  useEffect(() => {
    const addressesFromColis = colis
      .map((c) => c.street)
      .filter((street) => street && street.length > 0);

    setMapAddresses(addressesFromColis);
  }, [colis, setMapAddresses]);

  // Géocodage des adresses quand mapAddresses change
  useEffect(() => {
    async function geocodeAddresses() {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission de localisation refusée');
          setLoading(false);
          return;
        }

        const results: Coord[] = [];

        for (const street of addresses) {
          const geocode = await Location.geocodeAsync(street);
          if (geocode.length > 0) {
            results.push({
              latitude: geocode[0].latitude,
              longitude: geocode[0].longitude,
              street,
            });
          } else {
            console.warn(`Adresse introuvable: ${street}`);
          }
        }

        setCoords(results);
      } catch (error) {
        setErrorMsg('Erreur lors du géocodage des adresses');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } 

    if (addresses && addresses.length > 0) {
      geocodeAddresses();
    } else {
      setCoords([]);
      setLoading(false);
    }
  }, [addresses]);

  // Ajuster la vue de la carte pour afficher tous les markers
  useEffect(() => {
    if (coords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        coords.map(({ latitude, longitude }) => ({ latitude, longitude })),
        {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        }
      );
    }
  }, [coords]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Chargement de la carte...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{errorMsg}</Text>
      </View>
    );
  }

  if (coords.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Aucune adresse valide à afficher.</Text>
      </View>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: coords[0].latitude,
        longitude: coords[0].longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {coords.map(({ latitude, longitude, street }, index) => (
        <Marker
          key={index}
          coordinate={{ latitude, longitude }}
          title={street}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
