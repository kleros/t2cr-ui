import { Card, Text } from '@kleros/components';

export default function TokenWithID() {
  return (
    <Card
      sx={{ marginBottom: 2 }}
      mainSx={{ justifyContent: 'space-between', paddingY: 1 }}
    >
      <Text sx={{ fontWeight: 'bold', minWidth: 'fit-content' }}>Token ID</Text>
    </Card>
  );
}
