- skaffold dev

### share JWT_KEY to all pods

- kubectl create secret generic jwt-secret --from-literal=JWT_KEY=SECKET_KEY

### upload package to npmjs

- npm publish --access public
- npm version patch (increase version of package)
- npm publish

### port forward

- NATS event bus: kubectl port-forward nats-depl-pod-name 4222:4222
- NATS monitoring: kubectl port-forward nats-depl-pod-name 8222:8222 -> localhost:8222/streaming

### Use common package in services

- npm i @finik-tickets/common

### NATS streaming server

- -cid ticketing = cluster in k8s deployment
- Client id: Each connection has unique client id
- Cluster id: cluster include many channels
- Channel id: To publisher publish to this and listenr listen to channel

### NOTES

- Each services has separate database

### Setup a service

- Create source with Dockerfile
- Create file Deployment + Service
- Create file Database Deployment + Service (Mongo)
- Add routing to ingress nginx file
- Add to skaffold file (watching auto build and reload)
