import { Image, Text, Flex, Grid } from '@kleros/components';

import PageContent from '../components/page-content';
import Button from '../components/button';
import Search from '../components/search-bar';
import TokenCard from '../components/token-card';

const ItemCountLabel = ({
  itemName,
  count,
}) => (
  <Flex>
    <Text sx={{ fontWeight: 600, marginRight: '8px' }}>{itemName}</Text>
    <Text>{count}</Text>
  </Flex>
);

const dummyTokens = [
  {
    name: 'Synthetic ETC',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash:
      '/ipfs/QmTzjcLs3smWk98AykJQVfCDGF34kJWvJtuvW3ywd6Z7XX/sETC',
    ticker: 'sETC',
  },
  {
    name: 'Synthetic EOS',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash:
      '/ipfs/Qmd2h7dMTEpNqWyRMLTeQeskFKs5cufiB2hTiM8GX6Tqjo/sEOS',
    ticker: 'sEOS',
  },
  {
    name: 'Bankex',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash: '/ipfs/QmXHXGjSeoYXBXvUWw2NSMXs4PJqZfhiAyg4AuPBWXwc7G/BKX',
    ticker: 'BKX',
  },
  {
    name: 'Basic Attention Token',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash: '/ipfs/QmR8QegoHb5ATtpXCgUr1F7pgx6mVFJYMZHV695JwVdXTM/BAT',
    ticker: 'Bat',
  },
  {
    name: 'Spank',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash:
      '/ipfs/Qmc3EBxTvAMX2qwDHxpbNCAyEqUnGBMvQqQMy6ZgH5V6xV/BccxznZ3SwmyxjqxZHmAdfgSpLwocUphuYBFUwzYS6jGumnAP5WoQbzWy6WtPCFiLpxucG4hFRwxWSqhfDPbVXcN9R',
    ticker: 'SPX',
  },
  {
    name: 'IOTEX',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash:
      '/ipfs/QmPDnzqSbGUpX8dUdSWHtB5CoUwZrqePzcMHT4juR3wbga/IOTX',
    ticker: 'IOTX',
  },
  {
    name: 'Chai',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash:
      '/ipfs/QmeYXtXJbWLEwJNafmmqu4zaT1PhqpivXFbbrZ4PknXzpB/CHAI',
    ticker: 'CHAI',
  },
  {
    name: 'Synthetic EOS',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash:
      '/ipfs/Qmd2h7dMTEpNqWyRMLTeQeskFKs5cufiB2hTiM8GX6Tqjo/sEOS',
    ticker: 'sEOS',
  },
  {
    name: 'Bankex',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash: '/ipfs/QmXHXGjSeoYXBXvUWw2NSMXs4PJqZfhiAyg4AuPBWXwc7G/BKX',
    ticker: 'BKX',
  },
  {
    name: 'Basic Attention Token',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash: '/ipfs/QmR8QegoHb5ATtpXCgUr1F7pgx6mVFJYMZHV695JwVdXTM/BAT',
    ticker: 'Bat',
  },
  {
    name: 'Spank',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash:
      '/ipfs/Qmc3EBxTvAMX2qwDHxpbNCAyEqUnGBMvQqQMy6ZgH5V6xV/BccxznZ3SwmyxjqxZHmAdfgSpLwocUphuYBFUwzYS6jGumnAP5WoQbzWy6WtPCFiLpxucG4hFRwxWSqhfDPbVXcN9R',
    ticker: 'SPX',
  },
  {
    name: 'IOTEX',
    status: 'Registered',
    address: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    symbolMultihash:
      '/ipfs/QmPDnzqSbGUpX8dUdSWHtB5CoUwZrqePzcMHT4juR3wbga/IOTX',
    ticker: 'IOTX',
  },
];

export default function Index() {
  return (
    <>
      <Image src="/top-visual.svg" alt="banner" sx={{ width: '100%' }} />
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
        </Flex>
        <Flex
          sx={{
            justifyContent: 'space-between',
            marginY: '16px',
            fontSize: '14px',
          }}
        >
          <Flex sx={{ display: 'flex' }}>
            <ItemCountLabel itemName="Tokens curated" count={4024} />
            <Text sx={{ marginX: '8px' }}>|</Text>
            <ItemCountLabel itemName="Badges submitted" count={264} />
          </Flex>
        </Flex>
        <Grid columns={4} gap={3} sx={{ marginY: '32px' }}>
          {dummyTokens.map((token, i) => (
            <TokenCard token={token} key={i} />
          ))}
        </Grid>
      </PageContent>
    </>
  );
}
