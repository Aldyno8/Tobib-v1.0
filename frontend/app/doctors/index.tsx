import BottomNavigation from '@/components/BottomNavigation';
import useDoctorStore from '@/store/useDoctorStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function DoctorPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedspecialization, setSelectedspecialization] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { 
      toValue: 1, 
      duration: 500, 
      useNativeDriver: true 
    }).start();
  }, []);

  // Données statiques
  const upcomingAppointments = [
    {
      doctorName: "Dr. Sophie Martin",
      date: "2023-09-01T00:00:00Z",
      time: "10:00",
    },
  ];

  const {doctors} = useDoctorStore()

  console.log(doctors)

  const doctorList = [
    {
      id: "1",
      username: "Dr. Sophie Martin",
      specialization: "Médecin généraliste",
      rating: 4.8,
      workplace: "Paris, 75008",
      availability: "Disponible aujourd'hui",
      image: require("../../assets/images/user.png"),
      bgColor: '#EFF6FF',
    },
    {
      id: "2",
      username: "Dr. Thomas Dubois",
      specialization: "Cardiologue",
      rating: 4.9,
      workplace: "Paris, 75016",
      availability: "Disponible demain",
      image: require("../../assets/images/user.png"),
      bgColor: '#F0FDF4',
    },
    {
      id: "3",
      username: "Dr. Emma Petit",
      specialization: "Dermatologue",
      rating: 4.7,
      workplace: "Paris, 75007",
      availability: "Disponible le 15 mars",
      image: require("../../assets/images/user.png"),
      bgColor: '#FEF2F2',
    },
    {
      id: "4",
      username: "Dr. Lucas Bernard",
      specialization: "Psychiatre",
      rating: 4.9,
      workplace: "Paris, 75005",
      availability: "Disponible le 16 mars",
      image: require("../../assets/images/user.png"),
      bgColor: '#F5F3FF',
    },
  ];

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialization)));
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      doctor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesspecialization = selectedspecialization ? doctor.specialization === selectedspecialization : true;
    return matchesSearch && matchesspecialization;
  });

  const renderDoctorItem = ({ item }) => (
    <Animated.View 
      style={[
        styles.doctorCardAnimated, 
        { 
          opacity: fadeAnim,
          transform: [{ 
            translateY: fadeAnim.interpolate({ 
              inputRange: [0, 1], 
              outputRange: [20, 0] 
            }) 
          }] 
        }
      ]}
    >
      <TouchableOpacity 
        onPress={() => router.push('/doctors/' + item.id)} 
        style={[styles.doctorCard, { backgroundColor: ["#F5F3FF", "#FEF2F2"][Math.floor(Math.random()*2)] }]}
        activeOpacity={0.8}
      >
        <View style={styles.doctorImageContainer}>
          <Image source={require("../../assets/images/user.png")} style={styles.doctorImage} />
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>Dr. {item.username}</Text>
          <Text style={styles.doctorspecialization}>{item.specialization}</Text>
          
          <View style={styles.ratingContainer}>
            {/* <View style={styles.ratingBadge}>
              <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
              <Text style={styles.doctorRating}>{item.rating}</Text>
            </View> */}
            <View style={styles.workplaceBadge}>
              <MaterialCommunityIcons name="map-marker" size={12} color="#64748B" />
              <Text style={styles.doctorworkplace}>{item.workplace}</Text>
            </View>
          </View>
          
          <View style={styles.availabilityContainer}>
            <View style={styles.availabilityBadge}>
              <Text style={styles.availabilityText}>Disponible maintenant</Text>
            </View>
            <TouchableOpacity 
              style={styles.appointmentButton}
              onPress={(e) => {
                e.stopPropagation();
                router.push('/appointment/' + item.id);
              }}
            >
              <Text style={styles.appointmentButtonText}>Prendre RDV</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={['#F0F9FF', '#E0F2FE']}
            style={styles.headerBackground}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.pageTitle}>Consultation</Text>
                <Text style={styles.pageSubtitle}>Trouvez un professionnel de santé</Text>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.profileCircle}
                >
                  <Text style={styles.profileInitial}>M</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Contenu Principal */}
        <View style={styles.contentContainer}>
          {/* Prochain Rendez-vous */}
          {nextAppointment && (
            <Animated.View style={[styles.cardContainer, { 
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }]
            }]}>
              <TouchableOpacity 
                style={styles.cardTouchable}
                onPress={() => router.push('/appointments')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#EFF6FF', '#DBEAFE']}
                  style={[styles.card, styles.appointmentCard]}
                >
                  <View style={styles.cardRow}>
                    <View style={[styles.cardIconContainer, { backgroundColor: "#93C5FD" }]}>
                      <MaterialCommunityIcons name="calendar-clock" size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Prochain rendez-vous</Text>
                      <Text style={styles.cardSubtitle}>
                        <Text style={styles.cardHighlight}>{nextAppointment.doctorName}</Text> le{" "}
                        {format(parseISO(nextAppointment.date), "d MMMM", { locale: fr })} à {nextAppointment.time}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Barre de recherche */}
          <View style={styles.searchSection}>
            <View style={styles.searchInputContainer}>
              <MaterialCommunityIcons name="magnify" size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Rechercher un médecin ou une spécialité..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Filtres par spécialité */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spécialités</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.specializationContainer}
          >
            <TouchableOpacity 
              style={[styles.specializationButton, !selectedspecialization ? styles.specializationButtonActive : styles.specializationButtonInactive]}
              onPress={() => setSelectedspecialization(null)}
            >
              <Text style={[styles.specializationButtonText, !selectedspecialization ? styles.specializationButtonTextActive : styles.specializationButtonTextInactive]}>
                Tous
              </Text>
            </TouchableOpacity>
            
            {specialties.map((specialization) => (
              <TouchableOpacity 
                key={specialization}
                style={[styles.specializationButton, selectedspecialization === specialization ? styles.specializationButtonActive : styles.specializationButtonInactive]}
                onPress={() => setSelectedspecialization(specialization)}
              >
                <Text style={[styles.specializationButtonText, selectedspecialization === specialization ? styles.specializationButtonTextActive : styles.specializationButtonTextInactive]}>
                  {specialization}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Liste des médecins */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professionnels disponibles</Text>
            <Text style={styles.doctorsCount}>{filteredDoctors.length} résultats</Text>
          </View>
          
          {filteredDoctors.length > 0 ? (
            <FlatList
              data={filteredDoctors}
              renderItem={renderDoctorItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.doctorList}
            />
          ) : (
            <View style={styles.noDoctorContainer}>
              <View style={styles.noDoctorIconContainer}>
                <MaterialCommunityIcons name="doctor" size={48} color="#CBD5E1" />
              </View>
              <Text style={styles.noDoctorTitle}>Aucun médecin trouvé</Text>
              <Text style={styles.noDoctorSubtitle}>
                Essayez de modifier vos critères de recherche
              </Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSearchQuery("");
                  setSelectedspecialization(null);
                }}
              >
                <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 16,
  },
  headerBackground: {
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  profileButton: {
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginBottom: 24,
  },
  cardTouchable: {
    borderRadius: 16,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  appointmentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  cardHighlight: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  searchSection: {
    marginBottom: 16,
  },
  searchInputContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#0F172A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorsCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  specializationContainer: {
    paddingBottom: 8,
    marginBottom: 16,
  },
  specializationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  specializationButtonActive: {
    backgroundColor: '#2563EB',
  },
  specializationButtonInactive: {
    backgroundColor: '#E2E8F0',
  },
  specializationButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  specializationButtonTextActive: {
    color: '#FFFFFF',
  },
  specializationButtonTextInactive: {
    color: '#64748B',
  },
  doctorList: {
    paddingBottom: 100,
  },
  doctorCardAnimated: {
    marginBottom: 12,
  },
  doctorCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  doctorImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  doctorspecialization: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  doctorRating: {
    fontSize: 14,
    marginLeft: 4,
    color: '#0F172A',
    fontWeight: '500',
  },
  workplaceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  doctorworkplace: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  availabilityText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '500',
  },
  appointmentButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  appointmentButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  noDoctorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noDoctorIconContainer: {
    backgroundColor: '#F1F5F9',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  noDoctorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDoctorSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
});