import {
  ThemeProvider,
  AccountSettingsPopup as _AccountSettingsPopup,
} from '@kleros/components';

const theme = {
  colors: {
    vouching: '#4d00b4',
    pendingRegistration: '#ccc',
    pendingRemoval: '#ff9900',
    challengedRegistration: '#ffc700',
    challengedRemoval: '#ffc700',
    registered: '#009aff',
    removed: '#4a4a4a',
  },
};

// Invalid hook call error.
// export default function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <div>Hello</div>
//     </ThemeProvider>
//   );
// }

// Works fine.
export default function App() {
  return <div>Hello</div>;
}
