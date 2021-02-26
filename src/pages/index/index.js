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
import { useContracts, useWallet } from "../../providers";
import { chainIdToEtherscanName } from "../../utils";

import { SubmissionPopup } from "./popups";
import TokenPreviewCard from "./token-preview-card";

function ItemCountLabel({ itemName, count }) {
  return (
    <Flex>
      <Text sx={{ fontWeight: 500, marginRight: "8px" }}>{itemName}</Text>
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
      sharedStakeMultiplier
      requesterBaseDeposit
      arbitratorExtraData
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
  const { t2cr } = useContracts();
  const routerParameters = queryString.parse(useLocation().search) || {};
  const { search, status } = routerParameters || {};
  const [loadedTokens, setLoadedTokens] = useState([]);
  const [loadedSearchTokens, setLoadedSearchTokens] = useState([]);
  const [currentChainId, setCurrentChainId] = useState(1);
  const {
    account,
    walletModalControls,
    active,
    error: walletError,
    chainId = 1,
  } = useWallet();
  const { setWalletModalOpen } = walletModalControls;

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
    setIndexVariables(() => {
      const newVariables = {};

      if (!status || status === itemStatusEnum.None.key)
        delete newVariables.where;
      else if (
        status === itemStatusEnum.ChallengedRegistration.key ||
        status === itemStatusEnum.ChallengedRemoval.key
      ) {
        newVariables.where = { disputed: true };
        newVariables.where.status =
          status === itemStatusEnum.ChallengedRegistration.key
            ? itemStatusEnum.RegistrationRequested.key
            : itemStatusEnum.ClearingRequested.key;
      } else newVariables.where = { status, disputed: false };

      newVariables.skip = 0;

      return newVariables;
    });
  }, [status]);

  // Clear results if the user changes the chain.
  useEffect(() => {
    const { ethereum } = window;
    if (!active || walletError) return;

    const handleChainChanged = () => {
      setIndexVariables({});
      setLoadedSearchTokens([]);
      setLoadedTokens([]);
    };
    if (ethereum) ethereum.on("chainChanged", handleChainChanged);
    return () => {
      if (ethereum && ethereum.removeListener)
        ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [active, walletError]);
  // Also clear it if the default network is not mainnet.
  useEffect(() => {
    if (currentChainId === chainId) return;
    setCurrentChainId(chainId);
    setIndexVariables({});
    setLoadedSearchTokens([]);
    setLoadedTokens([]);
  }, [chainId, currentChainId]);

  const displayTokens =
    loadedSearchTokens && loadedSearchTokens.length > 0
      ? loadedSearchTokens
      : loadedTokens;

  // Token submission modal state.
  const [submissionModalOpen, setSubmissionModalOpen] = useState();
  const closeSubmissionModal = useCallback(
    () => setSubmissionModalOpen(false),
    []
  );
  const onSubmitClick = useCallback(() => {
    if (!account) {
      setWalletModalOpen(true);
      return;
    }
    setSubmissionModalOpen(true);
  }, [account, setWalletModalOpen]);

  // Registry data.
  const registry = (registryData && registryData.registries[0]) || {};
  const { numberOfSubmissions } = registry || {};

  // Event listeners
  useEffect(() => {
    if (!t2cr) return;

    // eslint-disable-next-line new-cap
    const tokenStatusChangeFilter = t2cr.filters.TokenStatusChange();
    t2cr.on(tokenStatusChangeFilter, () => {
      setTimeout(() => {
        setLoadedTokens([]);
        setIndexVariables({});
      }, 5000); // Delay to let subgraph sync.
    });
    return () => {
      t2cr.removeAllListeners(tokenStatusChangeFilter);
    };
  }, [t2cr]);

  return (
    <>
      <Image src="/top-visual.svg" alt="banner" sx={{ width: "100%" }} />
      <PageContent>
        <Text
          sx={{
            marginTop: "46px",
            marginBottom: "16px",
            fontSize: "24px",
            fontWeight: "500",
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
            id="openSubmitTokenModal"
            type="button"
            variant="primary"
            sx={{
              minWidth: "210px",
              marginY: [8, 8, 8, 0],
              height: ["60px", "60px", "60px", "auto"],
            }}
            onClick={onSubmitClick}
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
              minWidth: 280,
              fontSize: "16px",
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
                  network={chainIdToEtherscanName[chainId]}
                />
              ))}
          </Grid>
        </InfiniteScroll>
        <SubmissionPopup
          isOpen={submissionModalOpen}
          close={closeSubmissionModal}
        />
      </PageContent>
    </>
  );
}
