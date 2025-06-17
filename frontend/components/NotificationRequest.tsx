import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons';
import { useNotifications } from '@/lib/hooks/use-notifications'; // Assurez-vous que ce hook est adapté à RN

export function NotificationRequest() {
  const { isSupported, permissionGranted, requestPermission } = useNotifications();
  const [dismissed, setDismissed] = useState(false);

  // Si les notifications ne sont pas supportées, ou si la permission est déjà accordée,
  // ou si l'utilisateur a déjà fermé la bannière, ne rien afficher
  if (!isSupported || permissionGranted || dismissed) {
    return null;
  }

  // Animation d'apparition
  const animation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        "Autorisation requise",
        "Pour recevoir des rappels de médicaments, veuillez autoriser les notifications dans les paramètres de votre appareil."
      );
    }
  };

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="bell-outline" size={20} color="#2563EB" />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Activer les notifications</Text>
            <Text style={styles.description}>
              Recevez des rappels pour prendre vos médicaments à temps
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleRequestPermission}>
                <Text style={styles.primaryButtonText}>Activer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setDismissed(true)}>
                <Text style={styles.outlineButtonText}>Plus tard</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.dismissButton} onPress={() => setDismissed(true)}>
            <MaterialCommunityIcons name="close" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    marginBottom: 24,
  },
  card: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#EFF6FF', // bleu clair (blue-50)
    borderColor: '#DBEAFE',      // bleu (blue-100)
    borderWidth: 1,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: '#DBEAFE',
    padding: 8,
    borderRadius: 999,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14, // équivalent à text-sm
    fontWeight: '500',
    marginBottom: 4,
    color: '#111827',
  },
  description: {
    fontSize: 12, // équivalent à text-xs
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  outlineButtonText: {
    fontSize: 12,
    color: '#2563EB',
  },
  dismissButton: {
    padding: 4,
  },
});

export default NotificationRequest;
