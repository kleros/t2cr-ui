import { Flex, Grid, Image, Text } from "@kleros/components";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { graphql } from "relay-hooks";

import {
  Button,
  PageContent,
  SearchBar,
  Select,
  TokenCard,
  useQuery,
} from "../../components";
import { tokenStatusEnum } from "../../data";

function ItemCountLabel({ itemName, count }) {
  return (
    <Flex>
      <Text sx={{ fontWeight: 600, marginRight: "8px" }}>{itemName}</Text>
      <Text>{count}</Text>
    </Flex>
  );
}

export const PAGE_SIZE = 16;
export const indexQuery = graphql`
  query indexQuery(
    $skip: Int = 0
    $first: Int = 16
    $where: Token_filter = { status_not: Absent }
    $orderDirection: OrderDirection = desc
  ) {
    tokens(
      skip: $skip
      first: $first
      where: $where
      orderBy: lastStatusChangeTime
      orderDirection: $orderDirection
    ) {
      id
      status
      name
      ticker
      address
      symbolMultihash
      disputed
      appealPeriodStart
      appealPeriodEnd
    }
  }
`;

export default function Index() {
  const router = useRouter();
  const { props } = useQuery();
  const [loadedTokens, setLoadedTokens] = useState([]);
  const [fetching, setFetching] = useState();
  const tokens = router.query.search ? props?.tokensSearch : props?.tokens;

  const onLoadMore = useCallback(() => {
    if (fetching) return;

    setFetching(true);
    const query = { ...router.query };
    const skip = query.skip ? Number(query.skip) : 0;
    query.skip = skip + PAGE_SIZE;

    router.push({ query });
  }, [fetching, router]);

  useEffect(() => {
    setLoadedTokens((previousTokens) =>
      tokens ? previousTokens.concat(tokens) : previousTokens
    );
    setFetching(false);
  }, [tokens]);

  return (
    <>
      <Image src="/top-visual.svg" alt="banner" sx={{ width: "100%" }} />
      <PageContent>
        <Text
          sx={{
            marginTop: "46px",
            marginBottom: "16px",
            fontSize: "24px",
            fontWeight: "600",
            lineHeight: "33px",
            letterSpacing: "0",
            textAlign: "center",
          }}
        >
          Submit Tokens for Community Curation
        </Text>
        <Flex
          sx={{
            justifyContent: "space-between",
            marginTop: "30px",
            flexDirection: ["column", "column", "column", "row"],
          }}
        >
          <Button
            type="button"
            variant="primary"
            sx={{
              minWidth: "171px",
              marginY: [8, 8, 8, 0],
              height: ["60px", "60px", "60px", "auto"],
            }}
          >
            Submit Token
          </Button>
          <SearchBar
            sx={{
              flexGrow: 1,
              marginLeft: [0, 0, 0, "24px"],
              marginY: [8, 8, 8, 0],
              borderRadius: "3px",
              alignItems: "center",
              display: "flex",
            }}
          />
          <Select
            sx={{
              marginLeft: [0, 0, 0, 1],
              marginY: [8, 8, 8, 0],
              minWidth: 270,
              border: "1px solid #ccc;",
              borderRadius: "3px",
            }}
            items={tokenStatusEnum.array}
            onChange={({ kebabCase }) => {
              setLoadedTokens([]);
              const query = { ...router.query };
              delete query.skip;
              if (!kebabCase) delete query.status;
              else query.status = kebabCase;
              router.push({
                query,
              });
            }}
            value={tokenStatusEnum.array.find(
              ({ kebabCase }) => kebabCase === router.query.status
            )}
            label="Filter by status:"
            id="filter-by-status"
          />
        </Flex>
        <Flex
          sx={{
            justifyContent: "space-between",
            marginY: "16px",
            fontSize: "14px",
          }}
        >
          <Flex sx={{ display: "flex" }}>
            <ItemCountLabel itemName="Tokens curated" count={4024} />
            <Text sx={{ marginX: "8px" }}>|</Text>
            <ItemCountLabel itemName="Badges submitted" count={264} />
          </Flex>
        </Flex>
        <InfiniteScroll
          hasMore={!fetching}
          initialLoad={false}
          loadMore={onLoadMore}
        >
          <Grid columns={[1, 2, 3, 4]} gap={3} sx={{ marginY: "32px" }}>
            {loadedTokens.length > 0 &&
              loadedTokens?.map((token, index) => (
                <TokenCard token={token} key={`grid-item-${index}`} />
              ))}
          </Grid>
        </InfiniteScroll>
      </PageContent>
    </>
  );
}
