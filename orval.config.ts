import { defineConfig } from 'orval';

export default defineConfig({
  // Temporarily commented out - will be reconfigured for Quiz Maker API
  // api: {
  //   input: './core/openapi/openapi.json',
  //   output: {
  //     mode: 'tags-split',
  //     target: './core/api/generated',
  //     client: 'react-query',
  //     httpClient: 'axios',
  //     override: {
  //       mutator: {
  //         path: './core/api/axios.ts',
  //         name: 'axiosInstanceMutator',
  //       },
  //     },
  //   },
  // },
});
