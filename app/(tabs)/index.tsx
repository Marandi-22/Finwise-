import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

const scamPosts = [
  {
    id: '1',
    title: 'Fake UPI Scam',
    image: require('../../assets/images/scams/upi.jpg'),
    news: 'A Bengaluru-based techie was duped of ₹18,000 after scanning a QR code sent by a “buyer” on OLX. The scammer lured the victim with a fake item listing and claimed to send money upfront via UPI. When the techie scanned the QR code, the amount was debited instead. Police warn users never to scan codes to receive money.',
  },
  {
    id: '2',
    title: 'Phishing Email Scam',
    image: require('../../assets/images/scams/phishing.jpg'),
    news: 'Multiple Delhi residents have fallen prey to phishing emails that mimicked official bank notices. Victims reported entering their bank credentials on fake sites after clicking email links. Cybercrime officials urge users to verify URLs and avoid acting on messages that create urgency.',
  },
  {
    id: '3',
    title: 'KBC Lottery Scam',
    image: require('../../assets/images/scams/lottery.jpg'),
    news: 'A retired teacher from Jaipur lost ₹72,000 after receiving a message claiming he won ₹25 lakh in the KBC lottery. The scammers asked for a ₹299 “processing fee” first, then kept demanding more for taxes and verification. Officials confirmed the KBC lottery is not currently running and advised caution.',
  },
  {
    id: '4',
    title: 'Fake Job Offer Scam',
    image: require('../../assets/images/scams/job.png'),
    news: 'In Hyderabad, a final-year engineering student lost ₹12,000 after applying for a job via Telegram. The “recruiter” claimed a ₹499 training fee and sent a fake appointment letter. As more money was demanded, the student grew suspicious and reported the scam. Experts warn job seekers to avoid roles asking for upfront payments.',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {scamPosts.map((post) => (
        <View key={post.id} style={styles.card}>
          <Image source={post.image} style={styles.image} resizeMode="cover" />
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.news}>{post.news}</Text>
          <Button
            mode="contained"
            onPress={() =>
              router.push({
                pathname: '/simulator',
                params: { scamId: post.id, scamTitle: post.title },
              })
            }
            style={styles.simulateButton}
            labelStyle={styles.buttonLabel}
          >
            Simulate Scam
          </Button>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 40,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginHorizontal: 12,
    color: '#222',
  },
  news: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 12,
    color: '#444',
  },
  simulateButton: {
    marginHorizontal: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
});
