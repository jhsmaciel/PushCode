module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Indent with 4 spaces
    "indent": ["off", 4],

    // Indent JSX with 4 spaces
    "react/jsx-indent": ["error", 4],

    // Indent props with 4 spaces
    "react/jsx-indent-props": ["error", 4],
    
  }
};
