import React from "react";

import { SVG } from "../components";

function Question(props) {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      fill="none"
      viewBox="0 0 17 16"
      {...props}
    >
      <path
        fill={props.color || "#fff"}
        d="M8.231 0a8.001 8.001 0 000 16 8.001 8.001 0 000-16zm0 14.452A6.448 6.448 0 011.78 8 6.45 6.45 0 018.23 1.548 6.45 6.45 0 0114.683 8a6.448 6.448 0 01-6.452 6.452zm3.46-8.233c0 2.163-2.336 2.197-2.336 2.996v.204a.387.387 0 01-.387.387H7.495a.387.387 0 01-.387-.387V9.14c0-1.153.874-1.614 1.535-1.984.566-.318.914-.534.914-.955 0-.556-.71-.925-1.284-.925-.748 0-1.093.354-1.579.967a.387.387 0 01-.537.068l-.898-.68a.388.388 0 01-.085-.528c.762-1.12 1.733-1.748 3.244-1.748 1.583 0 3.273 1.235 3.273 2.864zm-2.105 5.394c0 .747-.607 1.355-1.355 1.355a1.356 1.356 0 01-1.354-1.355c0-.747.607-1.355 1.354-1.355.748 0 1.355.608 1.355 1.355z"
      />
    </SVG>
  );
}

export default Question;