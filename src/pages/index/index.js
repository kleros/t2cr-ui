import { gql, useQuery } from "@apollo/client";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useLocation } from "react-router-dom";
import { Flex } from "theme-ui";

import {
  Button,
  Grid,
  Image,
  PageContent,
  SearchBar,
  Select,
  Text,
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

const tokenPreviewFragment = gql`
  fragment tokenPreviewFragment on Token {
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
`;

const indexQuery = gql`
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
      ...tokenPreviewFragment
    }
  }
  ${tokenPreviewFragment}
`;

const registryQuery = gql`
  query registryQuery {
    registries(first: 1) {
      numberOfSubmissions
    }
  }
`;

const searchQuery = gql`
  query searchQuery($search: String = "") {
    tokenSearch(text: $search) {
      ...tokenPreviewFragment
    }
  }
  ${tokenPreviewFragment}
`;

export default function Index() {
  const history = useHistory();
  const routerParameters = queryString.parse(useLocation().search) || {};
  const { search, status } = routerParameters || {};
  const [loadedTokens, setLoadedTokens] = useState([]);
  const [loadedSearchTokens, setLoadedSearchTokens] = useState([]);

  // We use two queries: One to populate tokens on the infinite
  // scroll and one for text searches.
  const [indexVariables, setIndexVariables] = useState({});
  const [searchVariables, setSearchVariables] = useState({});
  const { data: tokensData, loading: tokensLoading } = useQuery(indexQuery, {
    variables: indexVariables,
  });
  const { data: searchData, loading: searchLoading } = useQuery(searchQuery, {
    variables: searchVariables,
  });

  // Fetch the number of submissions.
  const { data: registryData } = useQuery(registryQuery);

  // Runs when the user reaches the end of the page (infinite scroll).
  const fetchMore = useCallback(() => {
    setIndexVariables((previousVariables) => ({
      ...previousVariables,
      skip: previousVariables.skip ? previousVariables.skip + 16 : 16,
    }));
  }, []);

  // Add newly fetched tokens to the grid.
  useEffect(() => {
    const { tokens } = tokensData || {};
    if (!tokens) return;
    setLoadedTokens((previousTokens) => previousTokens.concat(tokens));
  }, [tokensData]);

  // Add search results
  useEffect(() => {
    const { tokenSearch } = searchData || {};

    if (!tokenSearch) return;
    setLoadedSearchTokens(tokenSearch);
  }, [searchData]);

  // Update search query string from navigation bar.
  useEffect(() => {
    setSearchVariables((previousVariables) => ({
      ...previousVariables,
      search,
      status,
    }));
  }, [search, status]);

  // Update tokens display from new status
  useEffect(() => {
    if (!status) return;

    setLoadedTokens([]); // Clear results.
    setIndexVariables((previousVariables) => {
      const newVariables = {
        ...previousVariables,
        skip: 0,
      };

      if (!status || status === itemStatusEnum.None.key)
        delete newVariables.where;
      else newVariables.where = { status };

      return newVariables;
    });
  }, [status]);

  const numberOfSubmissions =
    registryData?.registries[0].numberOfSubmissions || 0;

  const displayTokens =
    loadedSearchTokens && loadedSearchTokens.length > 0
      ? loadedSearchTokens
      : loadedTokens;

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
              marginLeft: [0, 0, 0, 8],
              marginY: [8, 8, 8, 0],
              borderRadius: "3px",
              alignItems: "center",
              display: "flex",
            }}
          />
          <Select
            sx={{
              marginLeft: [0, 0, 0, 8],
              marginY: [8, 8, 8, 0],
              minWidth: 320,
              border: "1px solid #ccc;",
              borderRadius: "3px",
            }}
            items={itemStatusEnum.array}
            onChange={({ key }) => {
              const newParameters = { ...routerParameters };
              if (!key) delete newParameters.status;
              else newParameters.status = key;
              history.push({
                pathname: "",
                search: `?${new URLSearchParams(newParameters).toString()}`,
              });
            }}
            value={
              itemStatusEnum.array.find(({ key }) => key === status) ||
              itemStatusEnum.None
            }
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
          dataLength={displayTokens.length}
          next={fetchMore}
          hasMore={displayTokens.length < 50}
        >
          <Grid
            columns={[1, 2, 3, 4]}
            gap={3}
            sx={{ marginY: "32px" }}
            loading={tokensLoading || searchLoading}
          >
            {displayTokens?.length > 0 &&
              displayTokens?.map((tokenPreview, index) => (
                <TokenPreviewCard
                  tokenPreview={tokenPreview}
                  key={`grid-item-${index}`}
                />
              ))}
          </Grid>
        </InfiniteScroll>
      </PageContent>
    </>
  );
}
