import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";

export default function ChatbotPage() {
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState([
    {
      id: "1",
      title: "Problème de sommeil",
      lastMessage: "Avez-vous essayé les techniques de relaxation ?",
      date: new Date(Date.now() - 86400000), // Hier
      unread: false
    },
    {
      id: "2",
      title: "Stress au travail",
      lastMessage: "Comment vous sentez-vous aujourd'hui ?",
      date: new Date(Date.now() - 172800000), // Avant-hier
      unread: true
    },
    {
      id: "3",
      title: "Premier contact",
      lastMessage: "Bonjour ! Comment puis-je vous aider ?",
      date: new Date(Date.now() - 2592000000), // Il y a 1 mois
      unread: false
    }
  ]);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header amélioré avec bouton historique */}
      <LinearGradient
        colors={['#F0F9FF', '#E0F2FE']}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Assistant psychologique</Text>
            <TouchableOpacity 
              onPress={() => setShowHistory(true)}
              style={[styles.historyButton, {backgroundColor : "#3B82F6", borderRadius : 10}]}
              
            >
              <Ionicons name="time-outline" size={25} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>Discutez avec notre assistant IA</Text>
        </View>
      </LinearGradient>

      {/* Modal des anciennes conversations */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showHistory}
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Anciennes discussions</Text>
            <TouchableOpacity 
              onPress={() => setShowHistory(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable 
                style={styles.conversationItem}
                android_ripple={{ color: '#f1f1f1' }}
              >
                <View style={styles.conversationContent}>
                  <Text style={styles.conversationTitle}>{item.title}</Text>
                  <Text 
                    style={[
                      styles.conversationMessage,
                      item.unread && styles.unreadMessage
                    ]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                </View>
                <View style={styles.conversationMeta}>
                  <Text style={styles.conversationDate}>
                    {format(item.date, 'dd MMM', { locale: fr })}
                  </Text>
                  {item.unread && (
                    <View style={styles.unreadBadge} />
                  )}
                </View>
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.conversationList}
          />
        </View>
      </Modal>

      <ChatInterface />
    </View>
  );
}

function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Bonjour ! Je suis votre assistant psychologique. Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const flatListRef = useRef(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Ajouter message utilisateur
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simuler une réponse du bot après un délai
    setTimeout(() => {
      const botMessage = {
        id: Date.now().toString() + "b",
        content: "Je comprends ce que vous ressentez. Pouvez-vous m'en dire plus sur cette situation ?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      // Faire défiler automatiquement
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 85 : 0}
    >
      {/* Liste des messages avec fond amélioré */}
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={styles.messagesBackground}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View
              entering={FadeInUp.duration(300)}
              exiting={FadeOut}
              style={styles.messageContainer}
            >
              <ChatMessage message={item} />
            </Animated.View>
          )}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>

      {/* Input de message amélioré */}
      <View style={styles.inputContainer}>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Écrivez votre message..."
          placeholderTextColor="#94A3B8"
          style={styles.inputField}
          onSubmitEditing={handleSendMessage}
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={styles.sendButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.sendButtonGradient}
          >
            <MaterialCommunityIcons
              name='send'
              size={20}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* <BottomNavigation/> */}
    </KeyboardAvoidingView>
  );
}

function ChatMessage({ message }) {
  const isUser = message.sender === "user";
  
  return (
    <View style={[
      styles.messageBubble,
      isUser ? styles.userBubble : styles.botBubble
    ]}>
      {!isUser && (
        <View style={styles.botAvatar}>
          <MaterialCommunityIcons name="robot-happy" size={20} color="#fff" />
        </View>
      )}
      <View style={isUser ? styles.userMessageContent : styles.botMessageContent}>
        <Text style={isUser ? styles.userMessageText : styles.botMessageText}>
          {message.content}
        </Text>
        <Text style={isUser ? styles.userTimeText : styles.botTimeText}>
          {format(message.timestamp, 'HH:mm', { locale: fr })}
        </Text>
      </View>
      {isUser && (
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>M</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 8,
  },
  headerContent: {
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  historyButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
  },
  closeButton: {
    padding: 8,
  },
  conversationList: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
    marginRight: 16,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  conversationMessage: {
    fontSize: 14,
    color: '#64748B',
  },
  unreadMessage: {
    fontWeight: '500',
    color: '#0F172A',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  conversationDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  messagesBackground: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginVertical: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    color: '#0F172A',
    fontSize: 16,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendButton: {
    marginLeft: 8,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  botBubble: {
    alignSelf: 'flex-start',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  userInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botMessageContent: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  userMessageContent: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  botMessageText: {
    color: '#0F172A',
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  botTimeText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'right',
  },
  userTimeText: {
    fontSize: 11,
    color: '#E0F2FE',
    marginTop: 4,
    textAlign: 'right',
  },
});