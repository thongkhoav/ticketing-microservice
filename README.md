- skaffold dev

### share JWT_KEY to all pods

- kubectl create secret generic jwt-secret --from-literal=JWT_KEY=SECKET_KEY

### upload package to npmjs

- npm publish --access public
- npm version patch (increase version of package)
- npm publish
