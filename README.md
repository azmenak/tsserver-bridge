# tsserver-bridge

This package was created in response to https://github.com/Microsoft/TypeScript/issues/30981

## NOW OBSOLETE 🎉

With the upgrade of electron in [VSCode 1.4](https://code.visualstudio.com/updates/v1_40#_typescripttsservermaxtsservermemory) and the addition of `typescript.tsserver.maxTsServerMemory`, this package can now be removed!

### Example Useage

```
npm install tsserver-bridge
npx tsserver-bridge --memory=4096 --destination=ts-custom
```

This script will create copy of typescript installed in `node_modules` and replace its `tsserver.js` file with a bridge
file which spawns a seperate node process, outside of electron with the given max memory option

### Integration

To make integration with vscode seamless, we add `tsserver-bridge` to our dependencies and add

```JSON
{
  "scripts": {
    "postinstall": "tsserver-bridge --memory=4096"
  }
}
```

In the `scripts` key of `package.json`

We create a workspace settings folder for vscode and add to `settings.json` in there

```JSON
{
  "typescript.tsdk": ".vscode/typescript/lib"
}
```
