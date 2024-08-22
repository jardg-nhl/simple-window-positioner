import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    background: {
      import: 'src/background.ts',
      runtime: false
    },
    option: {
      import: 'src/option.ts',
      runtime: false
    }
  }
} as Configuration;
