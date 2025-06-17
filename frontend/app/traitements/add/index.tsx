import BottomNavigation from '@/components/BottomNavigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const MEDICATION_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AddMedicationPage() {
  const router = useRouter();
  const [medications, setMedications] = useState([]);
  const [timeSlots, setTimeSlots] = useState(['08:00']);
  const [selectedColor, setSelectedColor] = useState(MEDICATION_COLORS[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateField, setDateField] = useState<'startDate' | 'endDate' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    startDate: new Date(),
    endDate: null,
  });

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, '12:00']);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = value;
    setTimeSlots(newTimeSlots);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const showDatepicker = (field: 'startDate' | 'endDate') => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        [dateField]: selectedDate
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.dosage || !formData.frequency) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newMedication = {
      id: Math.random().toString(36).substring(7),
      ...formData,
      color: selectedColor,
      timeSlots,
      taken: Array(timeSlots.length).fill(false),
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate?.toISOString(),
    };

    // Ici vous devriez normalement sauvegarder dans votre store ou API
    console.log('New medication:', newMedication);
    
    Alert.alert(
      'Succès', 
      `${formData.name} a été ajouté à votre liste`,
      [{ text: 'OK', onPress: () => router.push('/medications') }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#F0F9FF', '#E0F2FE']}
        style={styles.headerBackground}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajouter un médicament</Text>
          <View style={{ width: 24 }} /> {/* Pour l'alignement */}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Informations de base */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informations de base</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom du médicament*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Doliprane"
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dosage*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1000mg"
                value={formData.dosage}
                onChangeText={(text) => handleInputChange('dosage', text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fréquence*</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 3 fois par jour"
                value={formData.frequency}
                onChangeText={(text) => handleInputChange('frequency', text)}
              />
            </View>
          </View>

          {/* Horaires de prise */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Horaires de prise</Text>
            <Text style={styles.cardSubtitle}>Définissez les heures de prise</Text>
            
            {timeSlots.map((time, index) => (
              <View key={index} style={styles.timeSlotContainer}>
                <View style={styles.timeIcon}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#3B82F6" />
                </View>
                <TextInput
                  style={styles.timeInput}
                  value={time}
                  onChangeText={(text) => updateTimeSlot(index, text)}
                />
                <TouchableOpacity
                  onPress={() => removeTimeSlot(index)}
                  disabled={timeSlots.length === 1}
                  style={[styles.removeButton, timeSlots.length === 1 && styles.disabledButton]}
                >
                  <MaterialCommunityIcons 
                    name="minus" 
                    size={20} 
                    color={timeSlots.length === 1 ? "#94A3B8" : "#EF4444"} 
                  />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={addTimeSlot}
              style={styles.addTimeButton}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#3B82F6" />
              <Text style={styles.addTimeButtonText}>Ajouter un horaire</Text>
            </TouchableOpacity>
          </View>

          {/* Dates */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dates</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date de début</Text>
              <TouchableOpacity 
                onPress={() => showDatepicker('startDate')}
                style={styles.dateInput}
              >
                <Text>{format(formData.startDate, 'dd/MM/yyyy', { locale: fr })}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date de fin (optionnel)</Text>
              <TouchableOpacity 
                onPress={() => showDatepicker('endDate')}
                style={styles.dateInput}
              >
                <Text>{formData.endDate ? format(formData.endDate, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner'}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dateField ? formData[dateField] || new Date() : new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* Instructions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Instructions (optionnel)</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Ex: Prendre pendant les repas"
              value={formData.instructions}
              onChangeText={(text) => handleInputChange('instructions', text)}
              multiline
            />
          </View>

          {/* Couleur */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Couleur</Text>
            <View style={styles.colorPicker}>
              {MEDICATION_COLORS.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption
                  ]}
                >
                  {selectedColor === color && (
                    <MaterialCommunityIcons name="check" size={20} color="white" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Bouton de soumission */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.submitButtonGradient}
            >
              <Text style={styles.submitButtonText}>Ajouter le médicament</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBackground: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    marginTop: 8,
  },
  addTimeButtonText: {
    color: '#3B82F6',
    fontWeight: '500',
    marginLeft: 8,
  },
  dateInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});