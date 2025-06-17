import BottomNavigation from '@/components/BottomNavigation';
import useAuthStore from '@/store/useAuthStore';
import useDoctorStore from '@/store/useDoctorStore';
import useSlotStore from '@/store/useSlotStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function DashboardPage() {
  const navigation = useNavigation();
  const {setDoctors} = useDoctorStore();
  const {setSlots} = useSlotStore()
  const {token} = useAuthStore()

  console.log(token)

  useEffect(() => {
    
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`http://192.168.88.15:8000/api/contact/contact/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token?.access}`
          }
        });
        
        const data = await response.json();
        console.log(data)
        
        if (!response.ok) {
          alert(data.message || 'Erreur inconnue');
          return;
        }
    
        // Si succès, tu peux sauvegarder le token dans AsyncStorage
        console.log('docteurs:', data);
        setDoctors(data);
        // navigation vers ton app principale ici
      } catch (error) {
        alert("Une erreur est survenue");
        console.error(error);
      }
    }

    fetchDoctors()
    
  }, [])

  useEffect(() => {
    
    const fetchSlots = async () => {
      try {
        const response = await fetch(`http://192.168.88.15:8000/api/contact/slot/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token?.access}`
          }
        });
        
        const data = await response.json();
        console.log(data)
        
        if (!response.ok) {
          alert(data.message || 'Erreur inconnue');
          return;
        }
    
        // Si succès, tu peux sauvegarder le token dans AsyncStorage
        console.log('Slots:', data);
        setSlots(data);
        // navigation vers ton app principale ici
      } catch (error) {
        alert("Une erreur est survenue");
        console.error(error);
      }
    }

    fetchSlots()
    
  }, [])
  

  // Données statiques pour les médicaments
  const medications = [
    {
      name: "Doliprane",
      timeSlots: ["08:30", "14:00", "20:00"],
      taken: [false, true, false],
    },
    {
      name: "Ibuprofène",
      timeSlots: ["10:00", "16:00"],
      taken: [true, false],
    },
  ];

  // Données statiques pour les statistiques des médicaments
  const stats = {
    percentage: 75,
    taken: 3,
    total: 4,
  };

  // Données statiques pour les rendez-vous
  const upcomingAppointments = [
    {
      doctorName: "Dr. Martin",
      specialty: "Généraliste",
      date: "2023-08-24T00:00:00Z",
      time: "14:20",
    },
  ];

  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  // Gestion de l'heure et de la salutation
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Bonjour");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Bon après-midi");
    } else {
      setGreeting("Bonsoir");
    }

    return () => clearInterval(interval);
  }, []);

  const medicationProgress = stats.percentage;

  const healthMetrics = [
    {
      title: "Médicaments",
      value: `${stats.taken}/${stats.total}`,
      unit: "pris aujourd'hui",
      icon: <MaterialCommunityIcons name="pill" size={24} color="#fff" />,
      color: "#2563EB",
      bgGradient: ["#E0F2FE", "#BFDBFE"],
      trend: medicationProgress + "%",
      trendUp: medicationProgress >= 50,
      link: "Medications",
    },
    {
      title: "Prochain RDV",
      value: nextAppointment ? format(parseISO(nextAppointment.date), "d", { locale: fr }) : "—",
      unit: nextAppointment ? format(parseISO(nextAppointment.date), "MMM", { locale: fr }) : "",
      icon: <MaterialCommunityIcons name="calendar-clock" size={24} color="#fff" />,
      color: "#16A34A",
      bgGradient: ["#DCFCE7", "#BBF7D0"],
      trend: nextAppointment ? `${nextAppointment.time}` : "Aucun RDV",
      trendUp: nextAppointment ? true : false,
      link: "Appointments",
    },
  ];

  // Animation de fade pour l'ensemble du contenu
  const containerAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(containerAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Fonction pour déterminer le prochain médicament à prendre
  const getNextMedication = () => {
    const now = new Date();
    let nextMed = null;
    let minTimeDiff = Number.POSITIVE_INFINITY;

    medications.forEach((med) => {
      med.timeSlots.forEach((slot, index) => {
        if (med.taken[index]) return;
        const [hours, minutes] = slot.split(":").map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        if (slotTime < now) {
          slotTime.setDate(slotTime.getDate() + 1);
        }
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
                <Text style={styles.greeting}>{greeting}, Marie</Text>
                <Text style={styles.dateText}>{format(currentTime, "EEEE d MMMM", { locale: fr })}</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity 
                  style={styles.iconButton} 
                  onPress={() => navigation.navigate('Appointments')}
                >
                  <MaterialCommunityIcons name="bell-outline" size={24} color="#64748B" />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={styles.profileCircle}
                  >
                    <Text style={styles.profileInitial}>M</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Contenu Principal */}
        <View style={styles.contentContainer}>
          {/* Prochain Médicament */}
          {nextMedication && (
            <Animated.View style={[styles.cardContainer, {
              opacity: containerAnim,
              transform: [{ translateY: containerAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }]
            }]}>
              <TouchableOpacity 
                style={styles.cardTouchable} 
                onPress={() => navigation.navigate('Medications')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#EFF6FF', '#DBEAFE']}
                  style={[styles.card, styles.medicationCard]}
                >
                  <View style={styles.cardRow}>
                    <View style={[styles.cardIconContainer, { backgroundColor: "#93C5FD" }]}>
                      <MaterialCommunityIcons name="pill" size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>Prochain médicament</Text>
                      <Text style={styles.cardSubtitle}>
                        <Text style={styles.cardHighlight}>{nextMedication.medication.name}</Text> à {nextMedication.timeSlot}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.takeMedButton}>
                      <Text style={styles.takeMedText}>Prendre</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Section "Votre santé" */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Votre santé</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <Animated.View style={[styles.gridContainer, { 
            opacity: containerAnim,
            transform: [{ translateY: containerAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }]
          }]}>
            {healthMetrics.map((metric, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.metricCardTouchable}
                onPress={() => metric.link && navigation.navigate(metric.link)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={metric.bgGradient}
                  style={styles.metricCard}
                >
                  <View style={[styles.metricIconContainer, { backgroundColor: metric.color }]}>
                    {metric.icon}
                  </View>
                  <Text style={styles.metricTitle}>{metric.title}</Text>
                  <View style={styles.metricValueRow}>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricUnit}>{metric.unit}</Text>
                  </View>
                  <View style={styles.metricTrendRow}>
                    <MaterialCommunityIcons 
                      name={metric.trendUp ? "trending-up" : "trending-down"} 
                      size={14} 
                      color={metric.trendUp ? "#16A34A" : "#DC2626"} 
                    />
                    <Text style={[styles.metricTrend, { color: metric.trendUp ? "#16A34A" : "#DC2626" }]}>
                      {metric.trend}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Progression du jour */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progression du jour</Text>
            <Text style={styles.timeText}>{format(currentTime, "HH:mm")}</Text>
          </View>
          
          <Animated.View style={[styles.progressCard, {
            opacity: containerAnim,
            transform: [{ translateY: containerAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }]
          }]}>
            <View style={styles.progressContent}>
              <View style={styles.progressRow}>
                <View>
                  <Text style={styles.progressTitle}>Médicaments</Text>
                  <Text style={styles.progressSubtitle}>Pris aujourd'hui</Text>
                </View>
                <View style={styles.progressValueContainer}>
                  <Text style={styles.progressValue}>{medicationProgress}%</Text>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <LinearGradient
                    colors={['#60A5FA', '#2563EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBarFill, { width: `${medicationProgress}%` }]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>0%</Text>
                  <Text style={styles.progressLabel}>50%</Text>
                  <Text style={styles.progressLabel}>100%</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Activités récentes */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activités récentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
              <Text style={styles.linkText}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <Animated.View style={[styles.activitiesCard, {
            opacity: containerAnim,
            transform: [{ translateY: containerAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }],
            marginBottom: 100
          }]}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIconContainer, { backgroundColor: "#BFDBFE" }]}>
                <MaterialCommunityIcons name="pill" size={20} color="#2563EB" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Doliprane pris</Text>
                <Text style={styles.activityTime}>Aujourd'hui, 08:30</Text>
              </View>
              <View style={[styles.activityIndicator, { backgroundColor: "#16A34A" }]} />
            </View>
            
            <View style={styles.activityDivider} />
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIconContainer, { backgroundColor: "#BBF7D0" }]}>
                <MaterialCommunityIcons name="calendar-check" size={20} color="#16A34A" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>RDV Dr. Martin confirmé</Text>
                <Text style={styles.activityTime}>Hier, 14:20</Text>
              </View>
              <View style={[styles.activityIndicator, { backgroundColor: "#2563EB" }]} />
            </View>
            
            <View style={styles.activityDivider} />
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIconContainer, { backgroundColor: "#DDD6FE" }]}>
                <MaterialCommunityIcons name="message-text-outline" size={20} color="#7C3AED" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Session de chat terminée</Text>
                <Text style={styles.activityTime}>Hier, 10:15</Text>
              </View>
              <View style={[styles.activityIndicator, { backgroundColor: "#7C3AED" }]} />
            </View>
          </Animated.View>
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
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#64748B',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
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
  medicationCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    padding: 10,
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
  takeMedButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  takeMedText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
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
  linkText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCardTouchable: {
    width: '48%',
    borderRadius: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricCard: {
    borderRadius: 20,
    padding: 16,
    minHeight: 160,
  },
  metricIconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 4,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 4,
    marginBottom: 4,
  },
  metricTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  metricTrend: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  progressContent: {
    padding: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  progressValueContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#E2E8F0', 
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  activitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  activityIconContainer: {
    padding: 8,
    borderRadius: 12,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  activityTime: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  activityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timeText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
});