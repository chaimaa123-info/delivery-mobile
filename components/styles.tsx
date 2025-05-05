import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff', 
  },

  headerRight: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
 // Ajoutez un style pour le bouton de paramètres
 settingsButton: {
    position: 'absolute',
    top: 80,
  right: 20,
  zIndex: 10,
  alignItems: 'center',
  //flexDirection: 'row',  
  },

  settingsText: {
    fontSize: 14,
    color: '#003366',
    marginLeft: 5,
  },

  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginText: {  
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },


inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },

  inputWithIcon: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  icon: {
    marginRight: 8,
  },
  inputField: {  
    flex: 1,
    height: 50,
   
  }, 


selectButton: {
    backgroundColor: '#007AFF', 
    borderRadius: 50, 
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, 
    alignSelf: 'center', 
  },

  
  versionBar: {
    position: 'absolute',
    top: 40, 
    right: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 5, 
    paddingVertical: 19,
  },
  
  versionOption: {
    alignItems: 'center',
    marginBottom: 20,
  },

  versionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  }, 
  
  selectedVersion: {
    backgroundColor: '#005BB5', 
  },
  
  versionText: {
    color: '#333',  
    fontSize: 14,  
    fontWeight: '500',
  },  
    
  versionMessage: {
    position: 'absolute',
    top: 100, 
    right: 10,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'right',
  },  
  
  radioButton: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginHorizontal: 15, 
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  selectedInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },


// 🟩 STYLES POUR LE MODAL
modalOverlay: {
    flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalOption: {
  fontSize: 16,
  padding: 10,
  color: '#003366',
  borderBottomWidth: 1,
  width: '100%',
  textAlign: 'center', 
  },

  
});  

// Styles du logo séparés
const logoStyles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center', 
    marginBottom: 2,
    marginTop: 0,
  },
  logoImage: {
    width: 300, 
    height: 200,
    marginTop: 10,
  },
});

// Export des deux objets de style
export { logoStyles, styles };
