import { Card, Text, Button } from 'react-native-paper';

export default function ScamInfoCard({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <Card style={{ marginTop: 24 }}>
      <Card.Title title={`🧠 Learn about ${title}`} />
      <Card.Content>
        <Text>{summary}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => alert("This would link to a full article or video.")}>
          Read More
        </Button>
      </Card.Actions>
    </Card>
  );
}
