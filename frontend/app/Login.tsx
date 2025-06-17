import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp
} from "react-native-reanimated";
import useAuthStore from "@/store/useAuthStore";

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [screen, setScreen] = useState<'login' | 'register'>('login');
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState('');
  const {setToken} = useAuthStore()

  const router = useRouter()

  const handleAuth = async () => {
    setIsLoading(true);

    try {
      const endpoint = screen === 'login' ? 'login' : 'register/patient/';
      const response = await fetch(`http://192.168.88.15:8000/api/auth/${endpoint}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify({username : name, password }),
      });
      
      const data = await response.json();
      console.log(data)
      
      if (!response.ok) {
        alert(data.message || 'Erreur inconnue');
        return;
      }
  
      // Si succès, tu peux sauvegarder le token dans AsyncStorage
      console.log('Utilisateur connecté:', data);
      // navigation vers ton app principale ici
      
      if(screen == "login"){
          setToken(data)
          router.navigate("/dashboard");
      }
      setScreen('login')
    } catch (error) {
      alert("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ImageBackground 
      source={require('@/assets/images/icon.png')} 
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.95)']}
        style={styles.gradientOverlay}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingContainer}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {screen === 'login' ? (
              <Animated.View
                entering={FadeIn.duration(600)}
                exiting={FadeOut}
                style={styles.container}
              >
                <TouchableOpacity 
                  style={styles.skipButton}
                  onPress={() => console.log("Skip auth")}
                >
                  <Text style={styles.skipText}>Passer</Text>
                </TouchableOpacity>

                <Animated.View 
                  entering={SlideInDown.duration(800).easing(Easing.out(Easing.exp))} 
                  style={styles.header}
                >
                  <Animated.View style={styles.logoContainer}>
                    <MaterialCommunityIcons 
                      name="heart-pulse" 
                      size={80} 
                      color="#2563EB" 
                    />
                  </Animated.View>
                  <Text style={styles.title}>Content de vous revoir</Text>
                  <Text style={styles.subtitle}>
                    Connectez-vous pour accéder à votre espace santé
                  </Text>
                </Animated.View>

                <Animated.View
                  entering={SlideInUp.duration(800).delay(200).easing(Easing.out(Easing.exp))}
                  style={styles.formContainer}
                >
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      placeholder="nom utilisateur"
                      placeholderTextColor="#94A3B8"
                      value={name}
                      onChangeText={setName}
                      style={styles.input}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      placeholder="Mot de passe"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                    />
                    <TouchableOpacity 
                      onPress={togglePasswordVisibility}
                      style={styles.passwordToggle}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#64748B" 
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.forgotPasswordButton}>
                    <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleAuth}
                    style={styles.authButton}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#2563EB', '#1D4ED8']}
                      style={styles.buttonGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Se connecter</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text style={styles.socialButtonText}>Continuer avec Google</Text>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View 
                  entering={FadeIn.delay(400)}
                  style={styles.switchAuthContainer}
                >
                  <Text style={styles.switchAuthText}>
                    Vous n'avez pas de compte ?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => setScreen('register')}>
                    <Text style={styles.switchAuthLink}>S'inscrire</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            ) : (
              <Animated.View
                entering={FadeIn.duration(600)}
                exiting={FadeOut}
                style={styles.container}
              >
                <TouchableOpacity 
                  style={styles.skipButton}
                  onPress={() => console.log("Skip auth")}
                >
                  <Text style={styles.skipText}>Passer</Text>
                </TouchableOpacity>

                <Animated.View 
                  entering={SlideInDown.duration(800).easing(Easing.out(Easing.exp))} 
                  style={styles.header}
                >
                  <Animated.View style={styles.logoContainer}>
                    <MaterialCommunityIcons 
                      name="heart-plus" 
                      size={80} 
                      color="#2563EB" 
                    />
                  </Animated.View>
                  <Text style={styles.title}>Commencez votre voyage</Text>
                  <Text style={styles.subtitle}>
                    Créez un compte pour accéder à votre espace santé
                  </Text>
                </Animated.View>

                <Animated.View
                  entering={SlideInUp.duration(800).delay(200).easing(Easing.out(Easing.exp))}
                  style={styles.formContainer}
                >
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      placeholder="nom utilisateur"
                      placeholderTextColor="#94A3B8"
                      value={name}
                      onChangeText={setName}
                      style={styles.input}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      placeholder="Adresse email"
                      placeholderTextColor="#94A3B8"
                      value={email}
                      onChangeText={setEmail}
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      placeholder="Mot de passe"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                    />
                    <TouchableOpacity 
                      onPress={togglePasswordVisibility}
                      style={styles.passwordToggle}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#64748B" 
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
                    <TextInput
                      placeholder="votre age"
                      placeholderTextColor="#94A3B8"
                      value={age}
                      onChangeText={setAge}
                      style={styles.input}
                      keyboardType="numeric"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputWrapper}>
                  <Ionicons name="person" size={20} color="#64748B" style={styles.inputIcon} />
                  <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={styles.input}
                  >
                    <Picker.Item label="Sélectionnez le genre" value="" />
                    <Picker.Item label="Femelle" value="femelle" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Autre" value="autre" />
                  </Picker>
                </View>

                  <TouchableOpacity
                    onPress={handleAuth}
                    style={styles.authButton}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#2563EB', '#1D4ED8']}
                      style={styles.buttonGradient}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>S'inscrire</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      En vous inscrivant, vous acceptez nos{" "}
                      <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{" "}
                      <Text style={styles.termsLink}>Politique de confidentialité</Text>
                    </Text>
                  </View>

                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text style={styles.socialButtonText}>Continuer avec Google</Text>
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View 
                  entering={FadeIn.delay(400)}
                  style={styles.switchAuthContainer}
                >
                  <Text style={styles.switchAuthText}>
                    Vous avez déjà un compte ?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => setScreen('login')}>
                    <Text style={styles.switchAuthLink}>Se connecter</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  authButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#64748B',
    fontSize: 14,
    marginHorizontal: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  socialButtonText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#2563EB',
    fontWeight: '500',
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchAuthText: {
    color: '#64748B',
    fontSize: 14,
  },
  switchAuthLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AuthScreen;