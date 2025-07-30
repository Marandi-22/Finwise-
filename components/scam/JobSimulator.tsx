import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';

type Message = {
  id: number;
  sender: 'recruiter' | 'user';
  text: string;
};

export default function JobSimulator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const recruiterMessages = [
    "Hi! I'm from XYZ HR. We found your resume online and you’re shortlisted for a work-from-home job.",
    "This job pays ₹30,000/month. To confirm your spot, we require a small ₹500 training fee.",
    "Would you like me to send you the payment link now?",
  ];

  useEffect(() => {
    if (step < recruiterMessages.length) {
      setTyping(true);
      const timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), sender: 'recruiter', text: recruiterMessages[step] },
        ]);
        setTyping(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleUserResponse = (response: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: response }]);
    if (step < recruiterMessages.length) {
      setStep((s) => s + 1);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, typing]);

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollRef} style={styles.chatArea}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.recruiterBubble,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
        {typing && (
          <View style={[styles.messageBubble, styles.recruiterBubble]}>
            <ActivityIndicator size="small" />
            <Text style={styles.typingText}>Recruiter is typing...</Text>
          </View>
        )}
      </ScrollView>

      {step >= recruiterMessages.length ? (
        <View style={styles.result}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            ⚠ Scam Alert!
          </Text>
          <Text style={{ fontSize: 14 }}>
            Real recruiters never ask for money to confirm a job. This is a common scam tactic!
          </Text>
        </View>
      ) : (
        <View style={styles.buttons}>
          <Button mode="contained" onPress={() => handleUserResponse("Yes, send me the link")}>
            Agree
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleUserResponse("No, I need to think")}
            style={{ marginLeft: 8 }}
          >
            Reject
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
  chatArea: { flex: 1 },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  recruiterBubble: {
    backgroundColor: '#d4edda',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#0078fe',
    alignSelf: 'flex-end',
  },
  messageText: { color: '#000', fontSize: 14 },
  typingText: { marginTop: 5, fontSize: 12 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  result: { marginTop: 10, padding: 10, backgroundColor: '#fff3cd', borderRadius: 6 },
});
