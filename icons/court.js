import { SVG } from "@kleros/components";

export default function Court(props) {
  return (
    <SVG viewBox="0 0 16 12" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.57163 8.55556H6.57113C6.57113 8.14357 6.60463 8.33326 4.44488 3.93377C4.00363 3.03519 2.74013 3.0334 2.29813 3.93377C0.120131 8.37095 0.172131 8.15655 0.172131 8.55556H0.171631C0.171631 9.68051 1.60438 10.5926 3.37163 10.5926C5.13888 10.5926 6.57163 9.68051 6.57163 8.55556ZM3.37163 4.48148L5.17163 8.14815H1.57163L3.37163 4.48148ZM16.1711 8.55556C16.1711 8.14357 16.2046 8.33326 14.0449 3.93377C13.6036 3.03519 12.3401 3.0334 11.8981 3.93377C9.72013 8.37095 9.77213 8.15655 9.77213 8.55556H9.77163C9.77163 9.68051 11.2044 10.5926 12.9716 10.5926C14.7389 10.5926 16.1716 9.68051 16.1716 8.55556H16.1711ZM11.1716 8.14815L12.9716 4.48148L14.7716 8.14815H11.1716ZM13.3716 11.4074H8.97163V3.9022C9.55938 3.64019 10.0006 3.10063 10.1314 2.44444H13.3716C13.5926 2.44444 13.7716 2.26213 13.7716 2.03704V1.22222C13.7716 0.99713 13.5926 0.814815 13.3716 0.814815H9.76263C9.39763 0.32287 8.82388 0 8.17163 0C7.51938 0 6.94563 0.32287 6.58063 0.814815H2.97163C2.75063 0.814815 2.57163 0.99713 2.57163 1.22222V2.03704C2.57163 2.26213 2.75063 2.44444 2.97163 2.44444H6.21188C6.34263 3.10037 6.78363 3.64019 7.37163 3.9022V11.4074H2.97163C2.75063 11.4074 2.57163 11.5897 2.57163 11.8148V12.6296C2.57163 12.8547 2.75063 13.037 2.97163 13.037H13.3716C13.5926 13.037 13.7716 12.8547 13.7716 12.6296V11.8148C13.7716 11.5897 13.5926 11.4074 13.3716 11.4074Z"
        fill={props.color || "#4d00b4"}
      />
    </SVG>
  );
}
