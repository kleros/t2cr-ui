import { Card, Input } from "@kleros/components";
import { Search } from "@kleros/icons";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar({ sx }) {
  const router = useRouter();
  const [userQuery, setUserQuery] = useState("");
  const debounced = useDebouncedCallback((value) => {
    const query = { ...router.query };
    if (!value) delete query.search;
    else query.search = value.replaceAll(" ", " & ");
    router.push({ query });
  }, 300);
  const queryChanged = useCallback(
    (event) => {
      setUserQuery(event.target.value || "");
      debounced.callback(event.target.value);
    },
    [debounced]
  );

  return (
    <Card
      sx={{
        flexDirection: "row",
        boxShadow: "none",
        border: "1px solid #ccc",
        ...sx,
      }}
      mainSx={{ paddingX: 2, paddingY: 0 }}
    >
      <Input
        variant="mutedInput"
        aria-label="Search Token"
        placeholder="Search Token"
        icon={<Search />}
        onChange={queryChanged}
        value={userQuery}
      />
    </Card>
  );
}
