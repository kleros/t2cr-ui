import { forwardRef } from "react";
import { Box } from "theme-ui";

const Title = forwardRef(({ ...rest }, ref) => (
  <Box ref={ref} as="title" {...rest} />
));
Title.displayName = "Title";

export default Title;
