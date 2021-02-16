import { gql, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";
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

const indexQuery = gql`
  fragment tokenPreviewCard on Token {
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
  const routerParameters = useParams();
  const history = useHistory();
  const { loading, error, data } = useQuery(indexQuery);

  if (loading) console.info("loading:", loading);
  if (error) console.info("error:", error);
  if (data) console.info("data:", data);

  const loadedTokens = data?.tokens || [];
  const numberOfSubmissions = data?.registries[0].numberOfSubmissions || 0;

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
              const routerQuery = { ...routerParameters };
              delete routerQuery.skip;
              if (!kebabCase) delete routerQuery.status;
              else routerQuery.status = kebabCase;
              history.push({
                query: routerQuery,
              });
            }}
            value={itemStatusEnum.array.find(
              ({ kebabCase }) => kebabCase === routerParameters.status
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
        <Grid columns={[1, 2, 3, 4]} gap={3} sx={{ marginY: "32px" }}>
          {loadedTokens?.length > 0 &&
            loadedTokens?.map((tokenPreview, index) => (
              <TokenPreviewCard
                tokenPreview={tokenPreview}
                key={`grid-item-${index}`}
              />
            ))}
        </Grid>
      </PageContent>
    </>
  );
}
