import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

const scamPosts = [
  { id: 1, title: 'Fake UPI Scam', desc: 'Beware of random QR code requests.' },
  { id: 2, title: 'Ponzi Scheme', desc: 'Promises high returns, zero risk.' },
  { id: 3, title: 'Fake Job Offer', desc: 'Too-good-to-be-true jobs on Telegram or WhatsApp.' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {scamPosts.map((post) => (
        <Card key={post.id} style={styles.card}>
          <Card.Title title={post.title} />
          <Card.Content>
            <Text>{post.desc}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={() =>
                router.push({
                  pathname: '/simulator',
                  params: { scamId: post.id.toString(), scamTitle: post.title },
                })
              }
            >
              Simulate
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
});
