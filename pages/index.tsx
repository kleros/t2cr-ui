import { Image, Text } from '@kleros/components';
import { Flex } from 'theme-ui';

import PageContent from '../components/page-content';
import Button from '../components/button';
import Search from '../components/search-bar';
import Filter from '../components/filter';

export default function Index() {
  return (
    <>
      <Image src="/top-visual.svg" alt="banner" />
      <PageContent>
        <Text
          sx={{
            marginTop: '46px',
            marginBottom: '16px',
            fontSize: '24px',
            fontWeight: '600',
            lineHeight: '33px',
            letterSpacing: '0px',
            textAlign: 'center',
          }}
        >
          Submit Tokens for Community Curation
        </Text>
        <Flex sx={{ justifyContent: 'space-between', marginTop: '30px' }}>
          <Button type="button" variant="primary" sx={{ minWidth: '171px' }}>
            Submit Token
          </Button>
          <Search sx={{ flexGrow: 1, marginX: '24px' }} />
          <Filter sx={{ minWidth: '252px' }} />
        </Flex>
      </PageContent>
    </>
  );
}
