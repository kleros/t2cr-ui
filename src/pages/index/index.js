import { gql, useQuery } from "@apollo/client";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useLocation } from "react-router-dom";
import { Box, Flex, Link } from "theme-ui";

import {
  Button,
  Field,
  FileUpload,
  Form,
  Grid,
  Image,
  PageContent,
  Popup,
  SearchBar,
  Select,
  Text,
} from "../../components";
import { itemStatusEnum } from "../../data";
import { Info } from "../../icons";
import { useWallet } from "../../providers";
import { upload } from "../../utils";

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
  const { account, walletModalControls } = useWallet();
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

  // Token submission modal.
  const [tokenSubmissionModalOpen, setTokenSubmissionModalOpen] = useState();
  const closeTokenSubmissionModal = useCallback(
    () => setTokenSubmissionModalOpen(false),
    []
  );
  const onSubmitTokenClick = useCallback(() => {
    if (!account) {
      setWalletModalOpen(true);
      return;
    }
    setTokenSubmissionModalOpen(true);
  }, [account, setWalletModalOpen]);

  const totalCost = ethers.BigNumber.from(0); // TODO: Fetch actual data.

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
            type="button"
            variant="primary"
            sx={{
              minWidth: "210px",
              marginY: [8, 8, 8, 0],
              height: ["60px", "60px", "60px", "auto"],
            }}
            onClick={onSubmitTokenClick}
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
                />
              ))}
          </Grid>
        </InfiniteScroll>
        <Popup
          open={tokenSubmissionModalOpen}
          closeOnDocumentClick
          onClose={closeTokenSubmissionModal}
          overlayStyle={{ background: "rgba(0, 0, 0, 0.25)" }}
          sx={{
            maxWidth: "600px",
            overflowY: "auto",
            padding: "32px",
            backgroundColor: "white",
            maxHeight: "600px",
          }}
        >
          <Flex sx={{ justifyContent: "center" }}>
            <Text variant="popupTitle">Submit Token</Text>
          </Flex>
          <Form
            createValidationSchema={useCallback(
              ({ string }) => ({
                name: string()
                  .max(50, "Must be 50 characters or less.")
                  .required("Required"),
                ticker: string()
                  .min(2, "Must be more than 2 characters long.")
                  .required("Required"),
                address: string()
                  .max(42, "Must be 42 characters.")
                  .min(42, "Must be 42 characters.")
                  .required("Required"),
              }),
              []
            )}
            validate={({ symbol }) => {
              if (!symbol)
                return {
                  symbol: "Required",
                };
              return {};
            }}
            onSubmit={async ({ name, ticker, address, symbol }) => {
              const { pathname: symbolMultihash } = await upload(
                symbol.name,
                symbol.content
              );
              console.info(symbolMultihash);
              // TODO: contract interaction.
            }}
          >
            {({ isSubmitting }) => (
              <Flex sx={{ flexDirection: "column" }}>
                <Field
                  name="name"
                  label="Name"
                  placeholder="The token name (e.g. Wrapped Ether)."
                />
                <Field
                  name="ticker"
                  label="Ticker"
                  placeholder="The token ticker (e.g. WETH)."
                />
                <Field
                  name="address"
                  label="Address"
                  placeholder="e.g. 0x93ED3FBe21207Ec2E8f2d3c3de6e058Cb73Bc04d"
                />
                <Field
                  as={FileUpload}
                  name="symbol"
                  label="Upload the token logo"
                  accept="image/png, image/jpeg"
                  maxSize={1}
                  photo
                />
                <Flex sx={{ marginY: "16px" }}>
                  <Flex
                    sx={{
                      minWidth: "24px",
                      paddingTop: "2px",
                    }}
                  >
                    <Info />
                  </Flex>
                  <Text sx={{ fontSize: "14px", lineHeight: "19px" }}>
                    Important: Make sure the logo is a high-resolution PNG with
                    transparent background (Max size: 1Mb).
                  </Text>
                </Flex>
                <Flex
                  sx={{
                    flexDirection: "column",
                    backgroundColor: (theme) => theme.colors.accentMuted,
                    borderRadius: "3px",
                    border: (theme) => `1px solid ${theme.colors.accent}`,
                    color: (theme) => theme.colors.accent,
                    alignItems: "center",
                    padding: "16px",
                    marginY: "12px",
                  }}
                >
                  <Text sx={{ fontSize: "14px" }}>
                    Submission deposit required
                  </Text>
                  <Text sx={{ fontSize: "24px", fontWeight: 600 }}>
                    {formatEther(totalCost)} ETH
                  </Text>
                </Flex>
                <Flex
                  sx={{
                    marginY: "12px",
                    alignItems: "center",
                    border: (theme) => `1px solid ${theme.colors.primary}`,
                    padding: "16px",
                  }}
                >
                  <Flex
                    sx={{
                      minWidth: "24px",
                      paddingTop: "2px",
                    }}
                  >
                    <Info size={24} />
                  </Flex>
                  <Flex sx={{ flexDirection: "column", marginLeft: "16px" }}>
                    <Text
                      sx={{
                        color: (theme) => theme.colors.primary,
                        fontWeight: 600,
                        fontSize: "16px",
                      }}
                    >
                      Note
                    </Text>
                    <Text sx={{ fontSize: "14px", lineHeight: "19px" }}>
                      The Token must follow the <Link href="#">Criteria</Link>.
                      Tokens that do not follow the criteria risk being
                      challenged and removed. Make sure you read and understand
                      the criteria before proceeding. The deposit required is
                      reimbursed if the token is registered, the deposit is lost
                      if the token is removed.
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  sx={{
                    justifyContent: "space-between",
                    marginTop: "16px",
                    marginBottom: "32px",
                  }}
                >
                  <Button
                    variant="secondary"
                    onClick={closeTokenSubmissionModal}
                  >
                    Return
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    Submit
                  </Button>
                </Flex>
              </Flex>
            )}
          </Form>
        </Popup>
      </PageContent>
    </>
  );
}
