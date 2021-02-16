import { useCallback, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

import { Search } from "../icons";

import { Card, Input } from ".";

export default function SearchBar({ sx }) {
  const routeParameters = useParams();
  const history = useHistory();

  const [userQuery, setUserQuery] = useState("");
  const debounced = useDebouncedCallback((value) => {
    const query = { ...routeParameters };
    if (!value) delete query.search;
    else query.search = value.replaceAll(" ", " & ");
    history.push({ query });
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
