import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sendMessageToAI } from '../services/API/aiService';
import GradientText from './GradientText';
import { fetchMainProfile } from '../services/API/userInforService';
import { fetchAllMeasurements } from '../services/API/measurementsService';

export default function ChatModal({ visible, onClose }) {
  const [messages, setMessages] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [isTyping, setIsTyping] = useState(false); // 1. Thêm state mới

  useEffect(() => {
    if (visible) {
      setMessages([
        {
          _id: 1,
          text: 'Xin chào! Tôi là trợ lý sức khỏe AI. Hãy hỏi tôi bất cứ điều gì về các chỉ số của bạn.',
          createdAt: new Date(),
          user: { _id: 2, name: 'AI Assistant' },
        },
      ]);
      
      const loadHealthData = async () => {
        try {
          const profile = await fetchMainProfile();
          if (profile) {
            const allMeasurements = await fetchAllMeasurements();
            const userMeasurements = allMeasurements
              .filter(m => m.profileId === profile.id)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 10);
            setHealthData(userMeasurements);
          }
        } catch (error) {
          console.error("Failed to load health data for AI:", error);
        }
      };
      loadHealthData();
    }
  }, [visible]);

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    const userMessage = newMessages[0].text;
    
    setIsTyping(true); // 2. Bắt đầu "suy nghĩ"

    sendMessageToAI(userMessage, healthData)
      .then(replyText => {
        const aiMessage = {
          _id: Math.random().toString(36).substring(7),
          text: replyText,
          createdAt: new Date(),
          user: { _id: 2, name: 'AI Assistant' },
        };
        setIsTyping(false); // 3. Dừng "suy nghĩ"
        setMessages(previousMessages => GiftedChat.append(previousMessages, [aiMessage]));
      })
      .catch(err => {
         console.error(err);
         const errorMessage = {
            _id: Math.random().toString(36).substring(7),
            text: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.",
            createdAt: new Date(),
            user: { _id: 2, name: 'AI Assistant' },
         };
         setIsTyping(false); // 3. Dừng "suy nghĩ" (kể cả khi lỗi)
         setMessages(previousMessages => GiftedChat.append(previousMessages, [errorMessage]));
      });
  }, [healthData]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                <GradientText style={styles.headerTitle}>Trợ lý AI</GradientText>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{ _id: 1 }}
                    placeholder="Hỏi về sức khỏe của bạn..."
                    alwaysShowSend
                    isTyping={isTyping} // 4. Thêm prop vào GiftedChat
                    listViewProps={{
                        onPress: () => Keyboard.dismiss()
                    }}
                    />
                    {Platform.OS === 'ios' && <KeyboardAvoidingView behavior="padding" />}
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
  },
});