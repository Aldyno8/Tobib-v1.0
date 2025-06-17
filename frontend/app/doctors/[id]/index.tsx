import useDoctorStore from "@/store/useDoctorStore";
import useSlotStore from "@/store/useSlotStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get('window');

export default function DoctorDetailPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};
  
  // Données venant des stores
  const { doctors } = useDoctorStore();
  const { slots } = useSlotStore();

  // États
  const [doctor, setDoctor] = useState(null);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const foundDoctor = doctors.find((doc) => doc.id == id);
    setDoctor(foundDoctor);
    
    // Filtrer les créneaux pour ce médecin
    const filteredSlots = slots.filter(slot => slot.doctor === foundDoctor?.id);
    setDoctorSlots(filteredSlots);
  }, [id, doctors, slots]);

  const formatSlotTime = (slot) => {
    const startDate = parseISO(slot.start_time);
    const endDate = parseISO(slot.end_time);
    
    return {
      date: format(startDate, "yyyy-MM-dd"),
      dateLabel: format(startDate, "EEE d MMM", { locale: fr }),
      timeRange: `${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`,
      fullDate: format(startDate, "d MMMM yyyy", { locale: fr })
    };
  };

  const handleBookAppointment = () => {
    if (!selectedSlot) {
      Alert.alert("Erreur", "Veuillez sélectionner un créneau horaire");
      return;
    }

    setIsBooking(true);
    setTimeout(() => {
      const slotInfo = formatSlotTime(selectedSlot);
      Alert.alert(
        "Rendez-vous confirmé",
        `Votre rendez-vous avec ${doctor.username} le ${slotInfo.fullDate} de ${slotInfo.timeRange} a été confirmé.`
      );
      // navigation.navigate("Appointments");
      setIsBooking(false);
    }, 1500);
  };

  if (!doctor) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#EFF6FF', '#DBEAFE']}
        style={styles.headerContainer}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du médecin</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Carte du médecin */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image 
              source={require('@/assets/images/user.png')} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.doctorName}>Dr. {doctor.username}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialization}</Text>
              
              <View style={styles.locationContainer}>
                <MaterialCommunityIcons name="hospital-building" size={16} color="#64748B" />
                <Text style={styles.locationText}>{doctor.workplace}</Text>
              </View>
              
              {doctor.email && (
                <View style={styles.locationContainer}>
                  <MaterialCommunityIcons name="email" size={16} color="#64748B" />
                  <Text style={styles.locationText}>{doctor.email}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <MaterialCommunityIcons name="phone" size={20} color="#2563EB" />
              <Text style={styles.contactButtonText}>Appeler</Text>
            </TouchableOpacity>
            
            {doctor.email && (
              <TouchableOpacity style={styles.contactButton}>
                <MaterialCommunityIcons name="email" size={20} color="#2563EB" />
                <Text style={styles.contactButtonText}>Email</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Formulaire de rendez-vous */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Prendre rendez-vous</Text>
          
          {/* Liste des créneaux disponibles */}
          <Text style={styles.label}>Créneaux disponibles</Text>
          
          {doctorSlots.length === 0 ? (
            <Text style={styles.noSlotsText}>Aucun créneau disponible pour le moment</Text>
          ) : (
            <View style={styles.slotsContainer}>
              {doctorSlots.map((slot) => {
                const slotInfo = formatSlotTime(slot);
                return (
                  <TouchableOpacity
                    key={slot.id}
                    onPress={() => slot.is_available && setSelectedSlot(slot)}
                    style={[
                      styles.slotItem,
                      !slot.is_available && styles.slotItemDisabled,
                      selectedSlot?.id === slot.id && styles.slotItemSelected
                    ]}
                    disabled={!slot.is_available}
                  >
                    <Text style={styles.slotDate}>{slotInfo.dateLabel}</Text>
                    <Text style={[
                      styles.slotTime,
                      selectedSlot?.id === slot.id && styles.slotTimeSelected
                    ]}>
                      {slotInfo.timeRange}
                    </Text>
                    {!slot.is_available && (
                      <Text style={styles.slotUnavailable}>Indisponible</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Bouton de confirmation */}
          <TouchableOpacity
            onPress={handleBookAppointment}
            disabled={!selectedSlot}
            style={[
              styles.bookButton,
              (!selectedSlot) && styles.bookButtonDisabled
            ]}
          >
            {isBooking ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="calendar-check" size={20} color="#FFF" />
                <Text style={styles.bookButtonText}>Confirmer le rendez-vous</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E40AF',
  },
  // Content
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  // Profile Card
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  contactButtonText: {
    marginLeft: 8,
    color: '#2563EB',
    fontWeight: '500',
  },
  // Section Card
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  // Slots
  slotsContainer: {
    marginVertical: 8,
  },
  slotItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  slotItemDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  slotItemSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  slotDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  slotTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  slotTimeSelected: {
    color: '#2563EB',
  },
  slotUnavailable: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontStyle: 'italic',
  },
  noSlotsText: {
    textAlign: 'center',
    color: '#64748B',
    marginVertical: 16,
  },
  // Book Button
  bookButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  bookButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});