import antfu from '@antfu/eslint-config';

export default antfu({
  ignore: [
    "out",
        "dist",
        "**/*.d.ts"
  ]
})
