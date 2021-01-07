import { Card, Input } from "@kleros/components";
import { Search } from "@kleros/icons";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar({ sx }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debounced = useDebouncedCallback((value) => {
    const query = { ...router.query };
    if (!value) delete query.search;
    else query.search = value.replaceAll(" ", " & ");
    router.push({
      query,
    });
  }, 300);
  const queryChanged = useCallback((e) => {
    setQuery(e.target.value || "");
    debounced.callback(e.target.value);
  }, []);

  return (
    <Card
      sx={{
        flexDirection: "row",
        boxShadow: "none",
        border: "1px solid #CCCCCC",
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
        value={query}
      />
    </Card>
  );
}
