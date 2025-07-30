// Updated UPI Scam Chat Simulator with controlled timing and manual redirect
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface ChatMessage {
  sender: 'user' | 'scammer';
  text?: string;
  image?: any;
}

interface ReplyOption {
  text: string;
  next: ChatMessage[];
  success: boolean;
}

const chatFlow: ChatMessage[] = [
  {
    sender: 'scammer',
    text: 'Hi, I saw this bike on OLX. Still available?',
    image: require('../../assets/images/scams/bike.jpeg'),
  },
  {
    sender: 'user',
    text: 'Yes, it is. Are you interested?',
  },
  {
    sender: 'scammer',
    text: 'I’m in the army, can’t come myself. I’ll send my guy to collect. Can I pay via UPI?'
  }
];

const replyOptions: Record<number, ReplyOption[]> = {
  2: [
    {
      text: 'Sure, here is my UPI ID: seller@upi',
      next: [
        {
          sender: 'scammer',
          text: 'Actually, just scan this QR code to complete the payment. It’s faster.'
        },
        {
          sender: 'scammer',
          image: require('../../assets/images/scams/qr_placeholder.png')
        },
        {
          sender: 'scammer',
          text: 'Let me know once done, I’ll send my guy right away.'
        }
      ],
      success: false,
    },
    {
      text: 'Sounds fishy. Can you send an ID?',
      next: [
        {
          sender: 'scammer',
          text: 'Bro, trust me! This is urgent. Just scan it.'
        },
        {
          sender: 'scammer',
          text: 'I’m a genuine buyer. You’ll regret missing this.'
        },
        {
          sender: 'user',
          text: 'Yeah… no thanks. Something’s off.'
        }
      ],
      success: true,
    },
    {
      text: 'Sorry, I only deal in cash-on-delivery.',
      next: [
        {
          sender: 'scammer',
          text: 'Oh, okay. Then forget it.'
        },
        {
          sender: 'user',
          text: 'Dodged a scam there!'
        }
      ],
      success: true,
    },
  ]
};

export default function UpiSimulator() {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<ReplyOption[]>([]);
  const [queuedReplies, setQueuedReplies] = useState<ChatMessage[]>([]);
  const [finalAction, setFinalAction] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (step < chatFlow.length) {
      const timer = setTimeout(() => {
        setChat((prev) => [...prev, chatFlow[step]]);
        setStep((s) => s + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else if (step === chatFlow.length) {
      setOptions(replyOptions[step - 1] || []);
    }
  }, [step]);

  useEffect(() => {
    if (queuedReplies.length > 0) {
      const nextMsg = queuedReplies[0];
      const timer = setTimeout(() => {
        setChat((prev) => [...prev, nextMsg]);
        setQueuedReplies((prev) => prev.slice(1));
      }, 1300);
      return () => clearTimeout(timer);
    } else if (finalAction !== null) {
      setOptions([{ text: 'Continue', next: [], success: finalAction }]);
      setFinalAction(null);
    }
  }, [queuedReplies, finalAction]);

  const handleReply = (option: ReplyOption) => {
    setChat((prev) => [...prev, { sender: 'user', text: option.text }]);
    setOptions([]);
    setQueuedReplies(option.next);
    if (option.success !== null) setFinalAction(option.success);
  };

  const handleFinalRedirect = (success: boolean) => {
  if (success === false) {
    router.push('/simulator/mockUpiPayment'); // ✅ fixed path
  } else if (success === true) {
    router.push('/simulator/scam-avoided');
  } 
};

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingVertical: 12 }}>
        {chat.map((msg, index) => (
          <View
            key={index}
            style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.scammerBubble]}
          >
            {msg.image && <Image source={msg.image} style={styles.image} />}
            {msg.text && <Text style={styles.messageText}>{msg.text}</Text>}
          </View>
        ))}
      </ScrollView>
      <View style={styles.replyArea}>
        {options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.replyButton}
            onPress={() => {
              if (opt.next.length === 0 && opt.success !== null) {
                handleFinalRedirect(opt.success);
              } else {
                handleReply(opt);
              }
            }}
          >
            <Text style={styles.replyText}>{opt.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  chatArea: {
    paddingHorizontal: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  userBubble: {
    backgroundColor: '#d1f7c4',
    alignSelf: 'flex-end',
  },
  scammerBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  image: {
    width: 220,
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },
  replyArea: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  replyButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  replyText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});