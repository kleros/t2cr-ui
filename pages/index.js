import { Flex, Grid, Image, Text } from "@kleros/components";
import { useRouter } from "next/router";

import {
  Button,
  PageContent,
  SearchBar,
  Select,
  TokenCard,
} from "../components";
import { submissionStatusEnum } from "../data";
import { dummyTokens } from "../tools/data";

function ItemCountLabel({ itemName, count }) {
  return (
    <Flex>
      <Text sx={{ fontWeight: 600, marginRight: "8px" }}>{itemName}</Text>
      <Text>{count}</Text>
    </Flex>
  );
}

export default function Index() {
  const router = useRouter();
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
        <Flex sx={{ justifyContent: "space-between", marginTop: "30px" }}>
          <Button type="button" variant="primary" sx={{ minWidth: "171px" }}>
            Submit Token
          </Button>
          <SearchBar
            sx={{
              flexGrow: 1,
              marginLeft: "24px",
              borderRadius: "3px",
              alignItems: "center",
              display: "flex",
            }}
          />
          <Select
            sx={{
              marginLeft: 1,
              width: 270,
              border: "1px solid #ccc;",
              borderRadius: "3px",
            }}
            items={submissionStatusEnum.array}
            onChange={({ kebabCase }) => {
              const query = { ...router.query };
              if (!kebabCase) delete query.status;
              else query.status = kebabCase;
              router.push({
                query,
              });
            }}
            value={submissionStatusEnum.array.find(
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
        <Grid columns={[1, 2, 3, 4]} gap={3} sx={{ marginY: "32px" }}>
          {dummyTokens.map((token, index) => (
            <TokenCard token={token} key={index} />
          ))}
        </Grid>
      </PageContent>
    </>
  );
}
