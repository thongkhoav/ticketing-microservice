### Strimzi Kafka in Kubernetes

- kafka strimzi: https://strimzi.io/quickstarts/

### Run skaffold

- skaffold dev

### Host File Tweak

- C:\Windows\System32\Drivers\etc\hosts

### share JWT_KEY to all pods

- kubectl create secret generic jwt-secret --from-literal=JWT_KEY=SECKET_KEY
- kubectl create secret generic vnp_TmnCode --from-literal=vnp_TmnCode="from zalo sandbox"
- kubectl create secret generic vnp_HashSecret --from-literal=vnp_HashSecret="from zalo sandbox"

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

- Publisher override subjects
- Listener override subjects, queue group name, onMessage()
- Each services has separate database
- The Ticket service uses MongoDB with a Ticket collection.
- The Order service uses MongoDB with a duplicate Ticket collection (created when the Ticket service publishes an event) and an Order collection.
- User order ticker will lock ticket db (ticket service) and cancel order will unlock ticket db (ticket service)

### Setup a service

- Create source with Dockerfile
- Create file Deployment + Service
- Create file Database Deployment + Service (Mongo)
- Add routing to ingress nginx file
- Add to skaffold file (watching auto build and reload)

### connect pod

- kubectl exec -it orders-mongo-depl-846c5d559-dwqfw mongosh
