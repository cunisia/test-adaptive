export const color = {
  // Text colors
  'text-dark': '#212B36',
  text: '#4D5E71',
  'text-light': '#798B9D',
  'text-lighter': '#FFFFFF',

  // Border colors
  'border-dark': '#AABBCC',
  border: '#C0CCD9',
  'border-light': '#E1E5EF',

  // Background colors
  'background-darker': '#C0CCD9',
  'background-dark': '#E1E5EF',
  background: '#EFF2F9',
  'background-light': '#F7F8FA',
  'background-lighter': '#FFFFFF',
  'background-transparent': 'transparent',

  // Line colors
  'line-yellow': '#FFD345',
  'line-blue': '#7CBAE3',
  'line-green': '#69CB8B',
  'line-salmon': '#FFA38D',
  'line-dark-blue': '#17497E',
  'line-dark-purple': '#3C2E4D',
}

export type TColor = keyof typeof color