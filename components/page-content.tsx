import { Flex } from '@kleros/components';

const PageContent = ({ children }) => (
  <Flex sx={{ justifyContent: 'center', paddingBottom: '166px' }}>
    <Flex sx={{ width: '80%', flexDirection: 'column' }}>{children}</Flex>
  </Flex>
);

export default PageContent;
