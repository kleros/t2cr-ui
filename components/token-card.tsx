import { Card } from 'theme-ui';
import { Flex, Box, Image, Text, Link } from '@kleros/components';
import { EtherscanLogo } from '@kleros/icons';

interface Props {
  token: Token;
  network?: string;
}

const TokenCard = ({
  token: { status, name, ticker, address, symbolMultihash },
  network,
}: Props) => (
  <Card variant="primary">
    <Box
      sx={{
        background: 'rgba(0, 196, 43, 0.06)',
        paddingX: '24px',
        paddingY: '12px',
        borderTop: '5px solid #00c42b',
        fontWeight: 400,
        fontSize: '16px',
        borderRadius: 3,
      }}
    >
      {status}
    </Box>
    <Flex
      sx={{ alignItems: 'center', flexDirection: 'column', padding: '8px' }}
    >
      <Image
        width={96}
        src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${symbolMultihash}`}
        sx={{ margin: '8px' }}
      />
      <Text sx={{ margin: '8px' }}>
        {name} - {ticker}
      </Text>
    </Flex>
    <Flex
      sx={{
        justifyContent: 'space-between',
        marginTop: '8px',
        paddingX: '24px',
        backgroundColor: '#FBF9FE',
        borderRadius: '3px',
        height: 45,
        alignItems: 'center',
      }}
    >
      <Box>Badges</Box>
      <Link
        href={`https://${
          network && `${network}.`
        }etherscan.io/token/${address}`}
      >
        <EtherscanLogo />
      </Link>
    </Flex>
  </Card>
);

export default TokenCard;
