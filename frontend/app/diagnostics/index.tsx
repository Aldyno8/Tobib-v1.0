import BottomNavigation from '@/components/BottomNavigation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SymptomItem = ({ name, active, onToggle, onRemove, isCustom }) => {
  const getIconName = () => {
    switch(name) {
      case 'fever': return 'thermometer';
      case 'cough': return 'lungs';
      case 'headache': return 'head';
      case 'fatigue': return 'sleep';
      case 'soreThroat': return 'mouth';
      default: return 'alert-circle';
    }
  };

  const getDisplayName = () => {
    switch(name) {
      case 'fever': return 'Fièvre';
      case 'cough': return 'Toux';
      case 'headache': return 'Maux de tête';
      case 'fatigue': return 'Fatigue';
      case 'soreThroat': return 'Mal de gorge';
      default: return name;
    }
  };

  return (
    <View style={[styles.symptomItem, active && styles.activeSymptom]}>
      <View style={styles.symptomContent}>
        <View style={[styles.symptomIconContainer, active && styles.activeIconContainer]}>
          <MaterialCommunityIcons
            name={getIconName()}
            size={20}
            color={active ? '#3B82F6' : '#9CA3AF'}
          />
        </View>
        <Text style={[styles.symptomText, active && styles.activeSymptomText]}>
          {getDisplayName()}
        </Text>
      </View>
      <View style={styles.symptomControls}>
        {isCustom && (
          <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="trash" size={18} color="#EF4444" />
          </TouchableOpacity>
        )}
        <Switch
          value={active}
          onValueChange={onToggle}
          thumbColor={active ? '#FFFFFF' : '#F3F4F6'}
          trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
        />
      </View>
    </View>
  );
};

export default function DiagnosisScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showAddSymptomModal, setShowAddSymptomModal] = useState(false);
  const [customSymptom, setCustomSymptom] = useState('');
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    symptoms: {
      fever: false,
      cough: false,
      headache: false,
      fatigue: false,
      soreThroat: false
    },
    customSymptoms: [],
    duration: '',
    medicalHistory: {
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      asthma: false,
      other: ''
    }
  });

  const totalSteps = 4;

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSymptom = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: {
        ...prev.symptoms,
        [symptom]: !prev.symptoms[symptom]
      }
    }));
  };

  const toggleCustomSymptom = (index) => {
    const updatedSymptoms = [...formData.customSymptoms];
    updatedSymptoms[index].active = !updatedSymptoms[index].active;
    setFormData(prev => ({
      ...prev,
      customSymptoms: updatedSymptoms
    }));
  };

  const removeCustomSymptom = (index) => {
    const updatedSymptoms = [...formData.customSymptoms];
    updatedSymptoms.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      customSymptoms: updatedSymptoms
    }));
  };

  const toggleMedicalHistory = (condition) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [condition]: !prev.medicalHistory[condition]
      }
    }));
  };

  const handleAddSymptom = () => {
    if (customSymptom.trim()) {
      setFormData(prev => ({
        ...prev,
        customSymptoms: [...prev.customSymptoms, {
          name: customSymptom.trim(),
          active: true
        }]
      }));
      setCustomSymptom('');
      setShowAddSymptomModal(false);
    }
  };

  const validateForm = () => {
    if (step === 1 && (!formData.age || !formData.gender)) {
      Alert.alert('Information manquante', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (step === 3 && !formData.duration) {
      Alert.alert('Information manquante', 'Veuillez indiquer la durée des symptômes');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    Keyboard.dismiss();
    if (!validateForm()) return;

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSubmit();
    }
  };

  const prevStep = () => {
    Keyboard.dismiss();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = () => {
    setLoading(true);
    // Simulation de traitement
    setTimeout(() => {
      setLoading(false);
      setResult({
        risk: calculateRiskLevel(),
        message: getResultMessage(),
        recommendations: [
          "Restez hydraté et reposez-vous suffisamment",
          "Surveillez votre température régulièrement",
          "Consultez un médecin si les symptômes s'aggravent",
        ],
      });
    }, 2000);
  };

  const calculateRiskLevel = () => {
    const activeSymptoms = Object.values(formData.symptoms).filter(v => v).length +
      formData.customSymptoms.filter(s => s.active).length;

    if (activeSymptoms >= 4) return "high";
    if (activeSymptoms >= 2) return "medium";
    return "low";
  };

  const getResultMessage = () => {
    const risk = calculateRiskLevel();
    switch(risk) {
      case "high":
        return "Vos symptômes nécessitent une attention médicale rapide. Nous vous recommandons de consulter un professionnel de santé dès que possible.";
      case "medium":
        return "Vous présentez des symptômes qui méritent d'être surveillés. Consultez un médecin si votre état ne s'améliore pas dans les 48 heures.";
      default:
        return "Vos symptômes semblent bénins. Reposez-vous et surveillez votre état. Consultez si les symptômes persistent ou s'aggravent.";
    }
  };

  const resetForm = () => {
    setResult(null);
    setStep(1);
    setFormData({
      age: '',
      gender: '',
      symptoms: {
        fever: false,
        cough: false,
        headache: false,
        fatigue: false,
        soreThroat: false
      },
      customSymptoms: [],
      duration: '',
      medicalHistory: {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        asthma: false,
        other: ''
      }
    });
  };

  const getRiskColor = () => {
    if (!result) return '#4F46E5';
    return result.risk === "low"
      ? "#10B981"
      : result.risk === "medium"
        ? "#F59E0B"
        : "#EF4444";
  };

  const getRiskIcon = () => {
    if (!result) return 'help-circle';
    return result.risk === "low"
      ? "checkmark-circle"
      : "alert-circle";
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#E0F2FE', '#BAE6FD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.header}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={28} color="#1E40AF" />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Auto-diagnostic</Text>
              <Text style={styles.headerSubtitle}>Évaluation de vos symptômes</Text>
            </View>
          </LinearGradient>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            <ScrollView 
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {!result ? (
                <View style={styles.container}>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { width: `${(step / totalSteps) * 100}%` }
                        ]}
                      />
                    </View>
                    <View style={styles.stepIndicatorContainer}>
                      <Text style={styles.stepIndicatorText}>Étape {step} sur {totalSteps}</Text>
                    </View>
                  </View>

                  <View style={styles.card}>
                    {step === 1 && (
                      <View style={styles.step}>
                        <View style={styles.stepHeader}>
                          <Text style={styles.stepTitle}>Informations de base</Text>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{step}/{totalSteps}</Text>
                          </View>
                        </View>

                        <View style={styles.formGroup}>
                          <Text style={styles.label}>Âge</Text>
                          <TextInput
                            value={formData.age}
                            onChangeText={(text) => handleInputChange('age', text)}
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Entrez votre âge"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>

                        <View style={styles.formGroup}>
                          <Text style={styles.label}>Sexe</Text>
                          <View style={styles.optionGroup}>
                            {['Homme', 'Femme', 'Autre'].map((option) => {
                              const value = option === 'Homme' ? 'male' : 
                                            option === 'Femme' ? 'female' : 'other';
                              return (
                                <TouchableOpacity
                                  key={option}
                                  style={[
                                    styles.optionButton,
                                    formData.gender === value && styles.optionButtonActive
                                  ]}
                                  onPress={() => handleInputChange('gender', value)}
                                >
                                  <Text style={[
                                    styles.optionText,
                                    formData.gender === value && styles.optionTextActive
                                  ]}>
                                    {option}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                    )}

                    {step === 2 && (
                      <View style={styles.step}>
                        <View style={styles.stepHeader}>
                          <Text style={styles.stepTitle}>Vos symptômes</Text>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{step}/{totalSteps}</Text>
                          </View>
                        </View>

                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionTitle}>Symptômes principaux</Text>
                          <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => setShowAddSymptomModal(true)}
                          >
                            <Ionicons name="add" size={24} color="#3B82F6" />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.symptomList}>
                          {Object.entries(formData.symptoms).map(([key, value]) => (
                            <SymptomItem
                              key={key}
                              name={key}
                              active={value}
                              onToggle={() => toggleSymptom(key)}
                            />
                          ))}

                          {formData.customSymptoms.map((symptom, index) => (
                            <SymptomItem
                              key={`custom-${index}`}
                              name={symptom.name}
                              active={symptom.active}
                              onToggle={() => toggleCustomSymptom(index)}
                              onRemove={() => removeCustomSymptom(index)}
                              isCustom
                            />
                          ))}
                        </View>
                      </View>
                    )}

                    {step === 3 && (
                      <View style={styles.step}>
                        <View style={styles.stepHeader}>
                          <Text style={styles.stepTitle}>Durée des symptômes</Text>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{step}/{totalSteps}</Text>
                          </View>
                        </View>

                        <View style={styles.formGroup}>
                          <Text style={styles.label}>Depuis combien de temps ressentez-vous ces symptômes ?</Text>
                          <View style={styles.optionGroup}>
                            {['1-2 jours', '3-5 jours', '6-10 jours', 'Plus de 10 jours'].map((option) => (
                              <TouchableOpacity
                                key={option}
                                style={[
                                  styles.optionButton,
                                  formData.duration === option && styles.optionButtonActive
                                ]}
                                onPress={() => handleInputChange('duration', option)}
                              >
                                <Text style={[
                                  styles.optionText,
                                  formData.duration === option && styles.optionTextActive
                                ]}>
                                  {option}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </View>
                    )}

                    {step === 4 && (
                      <View style={styles.step}>
                        <View style={styles.stepHeader}>
                          <Text style={styles.stepTitle}>Antécédents médicaux</Text>
                          <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>{step}/{totalSteps}</Text>
                          </View>
                        </View>

                        <View style={styles.formGroup}>
                          <Text style={styles.label}>Conditions médicales existantes</Text>
                          <View style={styles.medicalHistoryList}>
                            {Object.entries(formData.medicalHistory).map(([key, value]) => {
                              if (key === 'other') return null;
                              
                              return (
                                <View key={key} style={styles.medicalItem}>
                                  <View style={styles.medicalContent}>
                                    <View style={[
                                      styles.medicalIconContainer,
                                      value && styles.activeIconContainer
                                    ]}>
                                      <MaterialCommunityIcons 
                                        name={
                                          key === 'diabetes' ? 'needle' :
                                          key === 'hypertension' ? 'heart-pulse' :
                                          key === 'heartDisease' ? 'heart' : 'lungs'
                                        } 
                                        size={20} 
                                        color={value ? '#3B82F6' : '#9CA3AF'} 
                                      />
                                    </View>
                                    <Text style={[
                                      styles.medicalText,
                                      value && styles.activeMedicalText
                                    ]}>
                                      {key === 'diabetes' && 'Diabète'}
                                      {key === 'hypertension' && 'Hypertension'}
                                      {key === 'heartDisease' && 'Maladie cardiaque'}
                                      {key === 'asthma' && 'Asthme'}
                                    </Text>
                                  </View>
                                  <Switch
                                    value={value}
                                    onValueChange={() => toggleMedicalHistory(key)}
                                    thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
                                    trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                                  />
                                </View>
                              );
                            })}
                          </View>
                        </View>

                        <View style={styles.formGroup}>
                          <Text style={styles.label}>Autres conditions médicales</Text>
                          <TextInput
                            value={formData.medicalHistory.other}
                            onChangeText={(text) => handleInputChange('medicalHistory', {
                              ...formData.medicalHistory,
                              other: text
                            })}
                            style={[styles.input, styles.textArea]}
                            multiline
                            numberOfLines={4}
                            placeholder="Décrivez vos autres conditions médicales"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                    )}

                    <View style={styles.navigationButtons}>
                      <TouchableOpacity
                        onPress={prevStep}
                        disabled={step === 1}
                        style={[
                          styles.navButton,
                          styles.secondaryButton,
                          step === 1 && styles.disabledButton
                        ]}
                      >
                        <Ionicons name="chevron-back" size={20} color="#3B82F6" />
                        <Text style={styles.secondaryButtonText}>Précédent</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={nextStep}
                        style={[
                          styles.navButton,
                          { backgroundColor: '#3B82F6' }
                        ]}
                        disabled={loading}
                      >
                        {loading ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <View style={{display : "flex", flexDirection : "row"}}>
                            <Text style={styles.primaryButtonText}>
                              {step === totalSteps ? 'Terminer' : 'Suivant'}
                            </Text>
                            {step !== totalSteps && (
                              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                            )}
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <View style={[
                      styles.resultIconContainer,
                      { backgroundColor: `${getRiskColor()}20` }
                    ]}>
                      <Ionicons 
                        name={getRiskIcon()} 
                        size={40} 
                        color={getRiskColor()} 
                      />
                    </View>
                    <Text style={styles.resultTitle}>Résultats du diagnostic</Text>
                    <Text style={[styles.resultRisk, { color: getRiskColor() }]}>
                      {result.risk === "low"
                        ? "Risque faible"
                        : result.risk === "medium"
                          ? "Risque modéré"
                          : "Risque élevé"}
                    </Text>
                  </View>

                  <Text style={styles.resultSummary}>{result.message}</Text>

                  <View style={styles.recommendationsSection}>
                    <Text style={styles.sectionTitle}>Recommandations</Text>
                    
                    <View style={styles.recommendationsList}>
                      {result.recommendations.map((item, index) => (
                        <View key={index} style={styles.recommendationItem}>
                          <View style={styles.bulletPoint}>
                            <Ionicons name="checkmark" size={16} color="#10B981" />
                          </View>
                          <Text style={styles.recommendationText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={resetForm}
                      style={[styles.actionButton, styles.secondaryActionButton]}
                    >
                      <Text style={styles.secondaryActionText}>Nouveau diagnostic</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: getRiskColor() }]}
                      onPress={() => navigation.navigate('Doctors')}
                    >
                      <Ionicons name="calendar" size={20} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>Prendre rendez-vous</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Modal pour ajouter un symptôme */}
          <Modal
            visible={showAddSymptomModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAddSymptomModal(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowAddSymptomModal(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Ajouter un symptôme</Text>
                      <TouchableOpacity 
                        onPress={() => setShowAddSymptomModal(false)}
                        style={styles.closeButton}
                      >
                        <Ionicons name="close" size={24} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    
                    <TextInput
                      value={customSymptom}
                      onChangeText={setCustomSymptom}
                      style={styles.modalInput}
                      placeholder="Décrivez votre symptôme"
                      placeholderTextColor="#9CA3AF"
                      autoFocus
                    />
                    
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        onPress={() => setShowAddSymptomModal(false)}
                        style={[styles.modalButton, styles.modalCancelButton]}
                      >
                        <Text style={styles.modalCancelText}>Annuler</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={handleAddSymptom}
                        style={[styles.modalButton, styles.modalConfirmButton]}
                        disabled={!customSymptom.trim()}
                      >
                        <Text style={styles.modalConfirmText}>Ajouter</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <BottomNavigation/>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4B5563',
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  stepIndicatorContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  stepIndicatorText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  step: {
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  stepNumber: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  optionButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 6,
  },
  optionButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  symptomList: {
    marginTop: 8,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeSymptom: {
    backgroundColor: '#F5F8FF',
  },
  symptomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symptomIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  activeIconContainer: {
    backgroundColor: '#DBEAFE',
  },
  symptomText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  activeSymptomText: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  symptomControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    marginRight: 12,
  },
  medicalHistoryList: {
    marginTop: 8,
  },
  medicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  medicalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medicalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  medicalText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeMedicalText: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 6,
  },
  secondaryButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  disabledButton: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginLeft: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginRight: 8,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resultRisk: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  resultSummary: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationsList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 6,
  },
  secondaryActionButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#111827',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  modalConfirmButton: {
    backgroundColor: '#3B82F6',
    marginLeft: 10,
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});