import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { graphql } from "relay-hooks";
import { Flex } from "theme-ui";

import {
  Button,
  Grid,
  Image,
  PageContent,
  SearchBar,
  Select,
  Text,
  useQuery,
} from "../../components";
import { itemStatusEnum } from "../../data";

import TokenPreviewCard from "./token-preview-card";

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
    $search: String = ""
  ) {
    tokens(
      skip: $skip
      first: $first
      where: $where
      orderBy: lastStatusChangeTime
      orderDirection: $orderDirection
    ) {
      ...tokenPreviewCard
    }
    tokenSearch(text: $search) {
      ...tokenPreviewCard
    }
    registries(first: 1) {
      numberOfSubmissions
    }
  }
`;

export default function Index() {
  const router = useRouter();
  const { props } = useQuery();
  const [firstLoad, setFirstLoad] = useState();
  const [loadedTokens, setLoadedTokens] = useState([]);
  const [fetching, setFetching] = useState();
  const {
    tokens: tokenPreviewFragments,
    tokenSearch: tokenSearchFragments,
    registries: registryFragments,
  } = props || {};
  const { query } = router || {};
  const { search } = query || {};

  useEffect(() => {
    if (firstLoad) return;

    setFirstLoad(true);
    setLoadedTokens([]);

    const routerQuery = { ...router.query };
    delete routerQuery.skip;

    router.push({
      query: routerQuery,
    });
  }, [firstLoad, router]);

  const onLoadMore = useCallback(() => {
    if (fetching || search || firstLoad) return;

    setFetching(true);
    const routerQuery = { ...router.query };
    const skip = routerQuery.skip ? Number(routerQuery.skip) : 0;
    routerQuery.skip = skip + PAGE_SIZE;

    router.push({ query: routerQuery });
  }, [fetching, firstLoad, router, search]);

  useEffect(() => {
    setLoadedTokens((previousTokens) =>
      search
        ? tokenSearchFragments
        : tokenPreviewFragments
        ? previousTokens.concat(tokenPreviewFragments)
        : previousTokens
    );
    setFetching(false);
  }, [tokenPreviewFragments, tokenSearchFragments, search]);

  const registry = registryFragments && registryFragments[0];
  const { numberOfSubmissions } = registry || {};

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
            items={itemStatusEnum.array}
            onChange={({ kebabCase }) => {
              setLoadedTokens([]);
              const routerQuery = { ...router.query };
              delete routerQuery.skip;
              if (!kebabCase) delete routerQuery.status;
              else routerQuery.status = kebabCase;
              router.push({
                query: routerQuery,
              });
            }}
            value={itemStatusEnum.array.find(
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
            <ItemCountLabel
              itemName="Tokens curated"
              count={numberOfSubmissions}
            />
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
            {loadedTokens?.length > 0 &&
              loadedTokens?.map((tokenPreviewFragment, index) => (
                <TokenPreviewCard
                  tokenPreviewFragment={tokenPreviewFragment}
                  key={`grid-item-${index}`}
                />
              ))}
          </Grid>
        </InfiniteScroll>
      </PageContent>
    </>
  );
}
