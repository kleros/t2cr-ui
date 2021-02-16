import { Flex } from "theme-ui";

function PageContent({ children }) {
  return (
    <Flex sx={{ justifyContent: "center", paddingBottom: "166px" }}>
      <Flex sx={{ width: "80%", flexDirection: "column" }}>{children}</Flex>
    </Flex>
  );
}

export default PageContent;
