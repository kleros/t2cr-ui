import { Card, Input } from '@kleros/components';
import { Search } from '@kleros/icons';

export default function SearchBar({ sx }) {
  return (
    <Card
      sx={{
        flexDirection: 'row',
        boxShadow: 'none',
        border: '1px solid #CCCCCC',
        ...sx,
      }}
      mainSx={{ paddingX: 2, paddingY: 0 }}
    >
      <Input
        variant="mutedInput"
        aria-label="Search Token"
        placeholder="Search Token"
        icon={<Search />}
      />
    </Card>
  );
}
