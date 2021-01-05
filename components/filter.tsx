import { Card } from '@kleros/components';
import { useRouter } from 'next/router';

import Select from './select';
import { submissionStatusEnum } from '../data';

export default function Filter({ sx }) {
  const router = useRouter();
  return (
    <Card
      sx={{
        flexDirection: 'row',
        boxShadow: 'none',
        border: '1px solid #CCCCCC',
        ...sx,
      }}
      mainSx={{ padding: 0 }}
    >
      <Select
        sx={{ width: '100%' }}
        items={submissionStatusEnum.array}
        onChange={({ kebabCase }) => {
          const query = { ...router.query };
          if (!kebabCase) delete query.status;
          else query.status = kebabCase;
          router.push({
            query,
          });
        }}
        value={submissionStatusEnum.array.find(
          ({ kebabCase }) => kebabCase === router.query.status
        )}
        label="Filter by status:"
      />
    </Card>
  );
}
