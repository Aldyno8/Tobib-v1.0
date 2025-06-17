import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LoginScreen from './Login';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<"splash" | "onboarding" | 'login'>("splash");
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: "Suivez vos traitements",
      description: "Gérez facilement vos médicaments et recevez des rappels pour ne jamais manquer une dose.",
      icon: <MaterialCommunityIcons name="pill" size={48} color="#2563EB" />,
      gradient: ['#EFF6FF', '#DBEAFE'],
      image: require('@/assets/images/icon.png'),
    },
    {
      title: "Prenez rendez-vous",
      description: "Trouvez des médecins et planifiez vos consultations en quelques clics.",
      icon: <MaterialCommunityIcons name="calendar-clock" size={48} color="#22C55E" />,
      gradient: ['#ECFDF5', '#D1FAE5'],
      image: require('@/assets/images/icon.png'),
    },
    {
      title: "Obtenez des conseils",
      description: "Décrivez vos symptômes et recevez des recommandations personnalisées.",
      icon: <MaterialCommunityIcons name="chat-processing" size={48} color="#FB923C" />,
      gradient: ['#FFFBEB', '#FEF3C7'],
      image: require('@/assets/images/icon.png'),
    },
    {
      title: "Tout est prêt !",
      description: "Votre compagnon santé personnel est configuré et prêt à vous aider.",
      icon: <MaterialCommunityIcons name="check-circle" size={48} color="#16A34A" />,
      gradient: ['#F0FDF4', '#DCFCE7'],
      image: require('@/assets/images/icon.png'),
    },
  ];

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Transition de l'écran splash vers l'onboarding
  useEffect(() => {
    if (stage === "splash") {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        setStage("onboarding");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Animation pour la transition entre étapes
  useEffect(() => {
    // Reset animations for new step
    slideAnim.setValue(30);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: (currentStep + 1) / onboardingSteps.length,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setStage('login');
    }
  };

  const handleSkip = () => {
    router.replace('/dashboard');
  };

  return (
    <View style={styles.container}>
      {stage === "splash" && (
        <Animated.View style={[styles.splash, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#EFF6FF', '#DBEAFE']}
            style={styles.splashGradient}
          >
            <Animated.View style={styles.splashIconContainer}>
              <MaterialCommunityIcons name="heart-pulse" size={120} color="#2563EB" />
            </Animated.View>
            <Text style={styles.title}>Toubib</Text>
            <Text style={styles.subtitle}>Votre compagnon santé personnel</Text>
          </LinearGradient>
        </Animated.View>
      )}

      {stage === 'onboarding' && (
        <LinearGradient
          colors={onboardingSteps[currentStep].gradient}
          style={styles.onboarding}
        >
          {/* Bouton Passer en haut à droite */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>

          {/* Barre de progression animée */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>

          {/* Image illustrative */}
          <View style={styles.imageContainer}>
            <Image 
              source={onboardingSteps[currentStep].image} 
              style={styles.stepImage}
              resizeMode="contain"
            />
          </View>

          {/* Contenu de l'étape avec animation */}
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              {onboardingSteps[currentStep].icon}
            </View>
            <Text style={styles.stepTitle}>
              {onboardingSteps[currentStep].title}
            </Text>
            <Text style={styles.stepDescription}>
              {onboardingSteps[currentStep].description}
            </Text>
          </Animated.View>

          {/* Dots indicateurs */}
          {/* <View style={styles.dotsContainer}>
            {onboardingSteps.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentStep(index)}
              >
                <View
                  style={[
                    styles.dot,
                    { 
                      backgroundColor: index === currentStep ? '#2563EB' : '#E5E7EB',
                      width: index === currentStep ? 24 : 8,
                    },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View> */}

          {/* Bouton Suivant / Commencer */}
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2563EB', '#1D4ED8']}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentStep < onboardingSteps.length - 1 ? 'Suivant' : 'Commencer'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {stage === 'login' && <LoginScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Splash screen
  splash: {
    flex: 1,
    width: '100%',
  },
  splashGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  splashIconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-light',
  },
  // Onboarding
  onboarding: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 24,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  skipText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    width: '80%',
    marginTop: 50,
    marginBottom: 40,
  },
  progressBarBackground: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: '#2563EB',
    height: 6,
    borderRadius: 3,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.3,
    marginBottom: 20,
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  stepContainer: {
    flex: 1,
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1F2937',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    height: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#E5E7EB',
  },
  nextButton: {
    width: width * 0.9,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
});