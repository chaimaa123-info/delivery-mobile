import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import ImageViewing from 'react-native-image-viewing';

export default function PhotoViewer() {
  const { uri } = useLocalSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  if (!uri) return null;

  const decodedUri = decodeURIComponent(uri as string);

  return (
   <ImageViewing
  images={[{ uri: decodedUri }]}
  imageIndex={0}
  visible={visible}
  onRequestClose={() => {
    setVisible(false);
    router.back();
  }}
  backgroundColor="black"               // Fond noir pour mieux voir l’image
  swipeToCloseEnabled={true}            // Permet de fermer en glissant
  doubleTapToZoomEnabled={true}         // Zoom au double tap
/>
  );
}
