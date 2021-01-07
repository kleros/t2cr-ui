import { base } from "@theme-ui/presets";
import { toTheme } from "@theme-ui/typography";
import { useMemo } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { ThemeProvider as _ThemeProvider, merge } from "theme-ui";
import typographyThemeSutro from "typography-theme-sutro";

export const typographyTheme = {
  ...typographyThemeSutro,
  bodyFontFamily: typographyThemeSutro.headerFontFamily,
  boldWeight: 600,
  googleFonts: [{ name: "Open Sans", styles: [300, "300i", 600, "600i"] }],
  headerWeight: 600,
};
export const theme = merge(merge(base, toTheme(typographyTheme)), {
  // Settings
  initialColorModeName: "light",
  useColorSchemeMediaQuery: true,

  // Colors
  colors: {
    text: "#000",
    background: "#fffffa",
    primary: "#009AFF",
    secondary: "#7BCBFF",
    accent: "#4d00b4",
    accentComplement: "#4d00b4",
    highlight: "#009aff",
    muted: "#fffcf0",
    skeleton: "#eee",
    skeletonHighlight: "#f5f5f5",
    success: "#00c851",
    warning: "#ffbb33",
    danger: "#ff4444",
    info: "#33b5e5",
    pendingRegistration: "#009aff",
    pendingRemoval: "#ccc",
    challengedRegistration: "#ff9900",
    challengedRemoval: "#ff9900",
    registered: "#00c42b",
    removed: "#6c6c6c",
    appealed: "#f60c36",
    crowdfunding: "#4d00b4",
  },

  // Styles
  styles: {
    hr: {
      color: "skeleton",
    },
  },

  // Layout
  layout: {
    header: {
      boxShadow: "0 1px 0 rgba(216, 213, 213, 0.5)",
      color: "background",
      fontFamily: "heading",
      lineHeight: "heading",
    },
    main: {
      backgroundColor: "background",
    },
    footer: {
      color: "background",
      fontFamily: "heading",
      lineHeight: "heading",
    },
  },

  // Components
  buttons: {
    primary: {
      borderRadius: 3,
      fontStyle: "normal",
      fontWeight: 600,
      lineHeight: "22px",
      fontSize: 16,
      paddingX: 2,
      paddingY: 1,
      ":disabled:not([data-loading=true])": {
        backgroundColor: "skeleton",
        backgroundImage: "none !important",
      },
      ":hover": {
        opacity: 0.8,
      },
      ":focus": {
        outline: "none",
      },
      spinner: {
        "div > div": {
          backgroundColor: "background",
          borderColor: "background",
        },
      },
      svg: { fill: "background" },
    },
    secondary: {
      backgroundColor: "transparent",
      backgroundImage: "none !important",
      borderColor: "skeleton",
      borderStyle: "solid",
      borderWidth: 1,
      color: "text",
      fontSize: 1,
      paddingX: 2,
      paddingY: 1,
      ":disabled:not([data-loading=true])": {
        color: "skeleton",
      },
      ":hover": {
        opacity: 0.8,
      },
      ":focus,&.active": {
        borderColor: "primary",
        color: "primary",
        outline: "none",
      },
    },
    select: {
      backgroundColor: "background",
      backgroundImage: "none !important",
      borderColor: "skeleton",
      borderStyle: "solid",
      borderWidth: 1,
      color: "text",
      paddingLeft: 2,
      paddingRight: 3,
      paddingY: 1,
      ":hover": {
        opacity: 0.8,
      },
      ":focus": {
        opacity: 0.8,
        outline: "none",
      },
      borderless: {
        border: 0,
        minWidth: "120px",
      },
    },
  },
  cards: {
    token: {
      background: "#fff",
      boxShadow: "0px 6px 24px rgba(77, 0, 180, 0.25)",
      backgroundColor: "background",
      borderRadius: 3,
      fontFamily: "heading",
      fontSize: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
  },
  forms: {
    checkbox: { marginTop: 1 },
    field: {
      error: {
        color: "danger",
        fontSize: "0.75em",
        marginLeft: 1,
        marginTop: "0.5em",
        icon: {
          stroke: "danger",
          ":hover": { opacity: 0.8 },
          path: { fill: "danger" },
        },
      },
      info: {
        color: "info",
        fontSize: "0.75em",
        marginTop: "0.5em",
      },
    },
    fileUpload: {
      backgroundColor: "muted",
      borderColor: "primary",
      borderRadius: 3,
      borderStyle: "dashed",
      borderWidth: 1,
      padding: 2,
      paddingRight: 6,
    },
    input: {
      borderColor: "skeleton",
      paddingY: 1,
      ":focus": {
        borderColor: "highlight",
        outline: "none",
      },
      "&.error": {
        borderColor: "danger",
      },
    },
    label: {
      display: "flex",
      flexDirection: "column",
      fontSize: 1,
      marginBottom: 2,
      visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: "1px",
      },
    },
    mutedInput: { border: "none", paddingY: 1 },
    textarea: { borderColor: "skeleton" },
  },
  images: {
    avatar: {
      borderRadius: 62,
      height: 124,
      width: 124,
    },
    thumbnail: {
      borderRadius: 3,
      width: 124,
    },
  },
  links: {
    navigation: {
      color: "background",
      textDecoration: "none",
    },
    footer: {
      color: "background",
      textDecoration: "none",
      fontWeight: 400,
    },
    unstyled: {
      color: "inherit",
      textDecoration: "none",
    },
  },
  select: {
    list: {
      backgroundColor: "background",
      borderRadius: 3,
      listStyle: "none",
      padding: 0,
      zIndex: 1000,
      ":focus": { outline: "none" },
      item: {
        paddingX: 2,
        paddingY: 1,
      },
    },
  },
  tabs: {
    tabList: {
      fontSize: 1,
      marginBottom: 3,
      marginTop: 2,
      padding: 0,
    },
    tab: {
      borderBottomColor: "skeleton",
      borderBottomStyle: "solid",
      borderBottomWidth: 1,
      padding: 1,
      textAlign: "center",
      "&[aria-selected=true]": {
        color: "primary",
      },
    },
  },
  text: {
    buttons: {
      primary: {
        justifyContent: "space-evenly",
      },
      secondary: {
        justifyContent: "space-evenly",
      },
      select: {
        justifyContent: "flex-start",
        paddingRight: 1,
      },
    },
    clipped: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});
export const klerosTheme = merge(theme, {
  // Colors
  colors: {
    primary: "#009aff",
    secondary: "#009aff",
    accent: "#4d00b4",
    accentComplement: "#4d00b4",
    muted: "#fbf9fe",
    background: "transparent",
    text: "text",
  },

  // Components
  buttons: {
    primary: {
      borderRadius: 3,
    },
  },
});
export default function ThemeProvider({ theme: _theme, children }) {
  const mergedTheme = useMemo(() => (_theme ? merge(theme, _theme) : theme), [
    _theme,
  ]);
  return (
    <_ThemeProvider theme={mergedTheme}>
      <SkeletonTheme
        color={mergedTheme.colors.skeleton}
        highlightColor={mergedTheme.colors.skeletonHighlight}
      >
        {children}
      </SkeletonTheme>
    </_ThemeProvider>
  );
}
