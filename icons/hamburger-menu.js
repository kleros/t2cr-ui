import { SVG } from "@kleros/components";

function HamburgerMenu() {
  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#fff"
        d="M.857 4.938h22.286A.866.866 0 0024 4.063V1.874A.866.866 0 0023.143 1H.857A.866.866 0 000 1.875v2.188c0 .483.384.875.857.875zm0 8.75h22.286a.866.866 0 00.857-.876v-2.187a.866.866 0 00-.857-.875H.857a.866.866 0 00-.857.875v2.188c0 .483.384.874.857.874zm0 8.75h22.286a.866.866 0 00.857-.875v-2.188a.866.866 0 00-.857-.875H.857a.866.866 0 00-.857.875v2.188c0 .483.384.875.857.875z"
      />
    </SVG>
  );
}

export default HamburgerMenu;
