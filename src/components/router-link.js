import { Link as RouterLink } from "react-router-dom";
import { Link as ThemeUILink } from "theme-ui";

function Link({ children, ...props }) {
  return (
    <ThemeUILink as={RouterLink} {...props}>
      {children}
    </ThemeUILink>
  );
}

export default Link;
