import { forwardRef, useRef } from "react";
import ReactRipples from "react-ripples";
import { PulseLoader } from "react-spinners";
import { Box, Flex, Button as _Button } from "theme-ui";

import { Popup, Text } from ".";

const Button = forwardRef(
  (
    {
      id,
      variant = "primary",
      sx,
      type = "button",
      disabled,
      children,
      loading,
      disabledTooltip,
      centerLabel = true,
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef();
    const button = (
      <_Button
        ref={ref}
        id={id}
        variant={variant}
        sx={{
          backgroundColor: variant,
          position: "relative",
          ":focus": {
            boxShadow({ colors: { text } }) {
              return `0 0 1px ${text}`;
            },
          },
          ...sx,
        }}
        type={type}
        disabled={disabled || !children || loading}
        data-loading={loading}
        {...rest}
      >
        <Flex sx={{ justifyContent: centerLabel ? "center" : "flex-start" }}>
          <Text
            ref={innerRef}
            id={id && `${id}-text`}
            variant={`buttons.${variant}`}
            sx={{
              alignItems: "center",
              display: "flex",
              border: "none",
            }}
          >
            {children}
          </Text>
          {loading && (
            <Box sx={{ marginLeft: "10px" }}>
              <PulseLoader size={6} color="white" />
            </Box>
          )}
        </Flex>
        <Box
          as={ReactRipples}
          sx={{
            height: "100%",
            left: 0,
            position: "absolute !important",
            top: 0,
            width: "100%",
          }}
          onClick={() => innerRef.current.click()}
        />
      </_Button>
    );
    return disabled && disabledTooltip ? (
      <Popup
        trigger={
          <Box
            sx={{
              display: "inline-block",
              height: sx?.height,
              width: sx?.width,
            }}
          >
            {button}
          </Box>
        }
        on={["focus", "hover"]}
        sx={{ backgroundColor: "skeleton", fontSize: 1 }}
      >
        {disabledTooltip}
      </Popup>
    ) : (
      button
    );
  }
);

Button.displayName = "Button";

export default Button;
