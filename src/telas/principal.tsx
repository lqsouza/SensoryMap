import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Image, Platform, StatusBar, Modal } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import firebaseConfig from '../firebaseConfig';

const logo = require('../../assets/logob.png');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [currentSector, setCurrentSector] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [routeInstructions, setRouteInstructions] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const sectors = [1, 2, 3, 4, 5, 6];

  const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  // Monitora mudanças no sensor RFID
  useEffect(() => {
    // lógica para obter o setor atual do sensor RFID

    const sectorDoc = doc(db, 'users', 'currentSector');
    
    // @ts-ignore
    setCurrentSector(1);
  }, []);

  // Busca a rota quando um setor é selecionado
  const handleSectorSelect = async (destinationSector: number) => {
    // @ts-ignore
    setSelectedSector(destinationSector);
    
    if (currentSector) {
      // Criar query para buscar a rota
      const rotasRef = collection(db, 'rotas');
      const q = query(
        rotasRef,
        where('pontoinicial', '==', currentSector),
        where('pontofinal', '==', destinationSector)
      );

      // Observar os resultados
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc) => {
          const routeData = doc.data();
          setRouteInstructions(routeData.instrucoes);
          setShowRoute(true);
        });
      });

      // Limpar o listener quando necessário
      return () => unsubscribe();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />
      <View style={[styles.container, { paddingTop: STATUSBAR_HEIGHT }]}>
        <Image source={logo} style={styles.logo} />

        <View style={styles.textContainer}>
          {currentSector ? (
            <Text style={styles.sectorText}>
              Você está no setor {currentSector}
            </Text>
          ) : (
            <Text style={styles.sectorText}>
              Aproxime-se de um sensor RFID
            </Text>
          )}

          <Text style={styles.instructionText}>
            Selecione o setor desejado abaixo
          </Text>
        </View>

        <View style={styles.buttonGrid}>
          {sectors.map((sector) => (
            <TouchableOpacity
              key={sector}
              style={[
                styles.sectorButton,
                selectedSector === sector && styles.selectedButton,
                currentSector === sector && styles.currentSectorButton
              ]}
              onPress={() => handleSectorSelect(sector)}
              disabled={!currentSector || currentSector === sector}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.buttonText,
                  selectedSector === sector && styles.selectedButtonText,
                  currentSector === sector && styles.currentSectorButtonText
                ]}
              >
                {sector}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Modal para mostrar a rota */}
        <Modal
          visible={showRoute}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRoute(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.routeTitle}>
                Rota do Setor {currentSector} para o Setor {selectedSector}
              </Text>
              
              <Text style={styles.routeText}>
                {routeInstructions}
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowRoute(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#75A67E',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 190,
    marginTop: 40,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectorText: {
    fontSize: 28,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 25,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
    maxWidth: 400,
    gap: 20,
  },
  sectorButton: {
    width: '40%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  selectedButton: {
    backgroundColor: '#557A5C',
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonText: {
    fontSize: 35,
    color: '#75A67E',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: 'white',
  },
  // ... seus estilos anteriores ...
  currentSectorButton: {
    backgroundColor: '#557A5C',
    opacity: 0.7,
  },
  currentSectorButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#75A67E',
  },
  routeText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#75A67E',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});