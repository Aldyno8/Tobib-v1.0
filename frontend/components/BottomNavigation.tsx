import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BottomNavigation() {
  const navigation = useNavigation();
  const route = useRoute();
  const router = useRouter()
  const currentRoute = route.name; // Supposons que le nom de la route corresponde aux clés de navigation

  const navItems = [
    { name: "Accueil", route: "dashboard", icon: "home" },
    { name: "Traitements", route: "traitements", icon: "pill" },
    { name: "Médecins", route: "doctors", icon: "doctor" },
    { name: "Chat", route: "chat", icon: "chat" },
    { name: "Diagnotiques", route: "diagnostics", icon: "stethoscope" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {navItems.map(item => {
          const isActive = currentRoute === (item.route + "/index");
          console.log(item.route + "/index", currentRoute)
          return (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.iconWrapper}>
                {isActive && (
                  <Animated.View style={styles.activeBackground} />
                )}
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={isActive ? '#2563EB' : '#6B7280'}
                />
              </View>
              <Text style={[styles.navText, isActive && styles.activeText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // Similaire à bg-background/80
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 96, // équivalent à h-16
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBackground: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(37, 99, 235, 0.1)', // Couleur primaire à 10%
    borderRadius: 999, // Rond
  },
  navText: {
    fontSize: 10,
    marginTop: 4,
    color: '#6B7280', // Couleur de texte désactivé
  },
  activeText: {
    color: '#2563EB', // Couleur primaire pour le texte actif
    fontWeight: '500',
  },
});
