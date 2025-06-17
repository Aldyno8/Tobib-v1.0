import BottomNavigation from '@/components/BottomNavigation';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MedicationsPage = () => {
  const router = useRouter();
  const [medications, setMedications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Données de démonstration
  useEffect(() => {
    setMedications([
      {
        id: '1',
        name: 'Doliprane',
        dosage: '1000mg',
        timeSlots: ['08:00', '14:00', '20:00'],
        taken: [false, false, false],
        color: '#3B82F6'
      },
      {
        id: '2',
        name: 'Aspirine',
        dosage: '500mg',
        timeSlots: ['09:00', '21:00'],
        taken: [false, false],
        color: '#10B981'
      },
      {
        id: '3',
        name: 'Vitamine D',
        dosage: '1000UI',
        timeSlots: ['08:30'],
        taken: [true],
        color: '#F59E0B'
      }
    ]);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const MedicationItem = ({ medication }) => {
    const [animateTaken, setAnimateTaken] = useState(null);

    const isTimeSlotPassed = (timeSlot, taken) => {
      if (taken) return false;
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0);
      return currentTime > slotTime;
    };

    const handleToggleTaken = (index) => {
      const wasTaken = medication.taken[index];
      const newMedications = medications.map(med => {
        if (med.id === medication.id) {
          const newTaken = [...med.taken];
          newTaken[index] = !newTaken[index];
          return { ...med, taken: newTaken };
        }
        return med;
      });
      
      setMedications(newMedications);
      
      if (!wasTaken) {
        setAnimateTaken(index);
        setTimeout(() => setAnimateTaken(null), 1000);
        Alert.alert('Médicament pris', `${medication.name} à ${medication.timeSlots[index]}`);
      }
    };

    const handleEdit = () => router.push(`/medications/edit/${medication.id}`);
    const handleDelete = () => {
      Alert.alert(
        'Confirmer',
        `Supprimer ${medication.name} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Supprimer', 
            style: 'destructive',
            onPress: () => {
              setMedications(medications.filter(m => m.id !== medication.id));
              Alert.alert('Succès', 'Médicament supprimé');
            }
          }
        ]
      );
    };

    const takenCount = medication.taken.filter(t => t).length;
    const totalCount = medication.timeSlots.length;

    return (
      <View style={styles.medicationItem}>
        <LinearGradient
          colors={['#F8FAFC', '#F1F5F9']}
          style={[styles.medicationGradient, { borderLeftWidth: 4, borderLeftColor: medication.color }]}
        >
          <View style={styles.medicationHeader}>
            <View>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Text style={styles.medicationDosage}>{medication.dosage}</Text>
            </View>
            <View style={styles.medicationActions}>
              <View style={styles.takenPill}>
                <Text style={styles.takenPillText}>{takenCount}/{totalCount}</Text>
              </View>
              <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                <MaterialCommunityIcons name="trash-can" size={24} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                <MaterialCommunityIcons name="pencil-box" size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeSlotsContainer}
          >
            {medication.timeSlots.map((time, index) => {
              const isTaken = medication.taken[index];
              const isLate = !isTaken && isTimeSlotPassed(time, isTaken);
              const isAnimating = animateTaken === index;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.7}
                  onPress={() => handleToggleTaken(index)}
                  style={[
                    styles.timeSlot,
                    isTaken && styles.timeSlotTaken,
                    isLate && styles.timeSlotLate,
                    isAnimating && styles.timeSlotAnimating
                  ]}
                >
                  {isTaken ? (
                    <MaterialCommunityIcons name="check" size={24} color="#10B981" />
                  ) : isLate ? (
                    <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
                  ) : (
                    <MaterialCommunityIcons name="clock" size={24} color="#64748B" />
                  )}
                  <Text style={[
                    styles.timeSlotText,
                    isTaken && styles.timeSlotTextTaken,
                    isLate && styles.timeSlotTextLate
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </LinearGradient>
      </View>
    );
  };

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.dosage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNextMedication = () => {
    const now = new Date();
    let nextMed = null;
    let minTimeDiff = Number.POSITIVE_INFINITY;

    medications.forEach((med) => {
      med.timeSlots.forEach((slot, index) => {
        if (med.taken[index]) return;

        const [hours, minutes] = slot.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0);

        if (slotTime < now) slotTime.setDate(slotTime.getDate() + 1);

        const timeDiff = slotTime.getTime() - now.getTime();
        if (timeDiff < minTimeDiff) {
          minTimeDiff = timeDiff;
          nextMed = { medication: med, timeSlot: slot, index };
        }
      });
    });

    return nextMed;
  };

  const nextMedication = getNextMedication();
  const handleAddMedication = () => router.push("/traitements/add");
  const handleSyncReminders = () => Alert.alert('Synchronisation', 'Vos rappels ont été synchronisés');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['#F0F9FF', '#E0F2FE']}
          style={styles.headerBackground}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Médicaments</Text>
              <Text style={styles.date}>
                {format(currentTime, 'EEEE d MMMM', { locale: fr })}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.syncButton}
              onPress={handleSyncReminders}
            >
              <MaterialCommunityIcons name="calendar-sync" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {nextMedication && (
            <Animated.View style={[styles.nextMedicationCard, { opacity: fadeAnim }]}>
              <TouchableOpacity onPress={() => router.push('/medications')}>
                <LinearGradient
                  colors={['#EFF6FF', '#DBEAFE']}
                  style={styles.card}
                >
                  <View style={styles.cardRow}>
                    <View style={[styles.cardIcon, { backgroundColor: '#93C5FD' }]}>
                      <MaterialCommunityIcons name="clock-outline" size={24} color="white" />
                    </View>
                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>Prochain médicament</Text>
                      <Text style={styles.cardSubtitle}>
                        {nextMedication.medication.name} à {nextMedication.timeSlot}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Feather name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un médicament..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <MaterialCommunityIcons name="filter-variant" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vos traitements</Text>
          </View>

          {filteredMedications.length > 0 ? (
            <Animated.View style={{ opacity: fadeAnim }}>
              {filteredMedications.map(medication => (
                <MedicationItem 
                  key={medication.id} 
                  medication={medication} 
                />
              ))}
            </Animated.View>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="pill" size={48} color="#CBD5E1" />
              <Text style={styles.emptyStateTitle}>
                {searchQuery ? 'Aucun résultat' : 'Aucun médicament'}
              </Text>
              <Text style={styles.emptyStateText}>
                {searchQuery 
                  ? 'Essayez une autre recherche' 
                  : 'Commencez par ajouter vos médicaments'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={handleAddMedication}
                >
                  <Text style={styles.addButtonText}>Ajouter un médicament</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleAddMedication}
      >
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          style={styles.floatingButtonGradient}
        >
          <Feather name="plus" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <BottomNavigation />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    marginBottom: 16,
  },
  headerBackground: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#64748B',
  },
  syncButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  nextMedicationCard: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#0F172A',
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  medicationItem: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medicationGradient: {
    padding: 16,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  medicationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  takenPill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  takenPillText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    paddingBottom: 4,
  },
  timeSlot: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'white',
  },
  timeSlotTaken: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  timeSlotLate: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  timeSlotAnimating: {
    transform: [{ scale: 1.1 }],
  },
  timeSlotText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    fontWeight: '500',
  },
  timeSlotTextTaken: {
    color: '#10B981',
  },
  timeSlotTextLate: {
    color: '#EF4444',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default MedicationsPage;