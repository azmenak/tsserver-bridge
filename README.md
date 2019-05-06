# tsserver-bridge

This package was created in response to https://github.com/Microsoft/TypeScript/issues/30981

### Example Useage

```
npm install tsserver-bridge
npx tsserver-bridge --memory=4096 --destination=ts-custom
```

This script will create copy of typescript installed in `node_modules` and replace its `tsserver.js` file with a bridge
file which spawns a seperate node process, outside of electron with the given max memory option
