import typescript from "@rollup/plugin-typescript";

export default {
  input: "GainsIQClient.ts",
  output: [
    {
      file: "dist/gainsiq-sdk.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/gainsiq-sdk.esm.js",
      format: "esm",
    },
  ],
  plugins: [typescript()],
};