# Testing NodeJS with RabbitMQ

This code is a test using 2 microservices using [RabbitMQ](https://www.rabbitmq.com/), [NodeJS](https://nodejs.org/en/), [Express](https://expressjs.com/), [MySQL](https://www.mysql.com/) and [Prisma](https://www.prisma.io/).

---
## Requirements
1. Have Node installed;
2. Have Docker installed;
---
## Installation 

In the root folder, load docker with the command:

```bash 
docker-compose -f "docker-compose.yaml" up -d --build
```

The microservices are running outside of docker.
Enter the service1 and service2 folders and run in each one:

```bash 
npm install
npx prisma migrate dev
```
`npx prisma migrate` This command will create the database for each microservice.

To run the systems, with the terminal on each separate run:

```bash 
npm run dev
```

That way the 2 services will be running on their proper terminals.

---

## Usage

To access RabbitMQ use http://localhost:15672/ the Username and Password are `admin`.

The service1 has one Post Request at http://localhost:3000/newproduct and the body:
```json
{
	"name": "test1",
	"bar_code": "10",
	"price": 15.20,
	"quantity": 3
}
```
If using Postman, just import the file `Node_with_RabbitMQ.postman_collection.json`

In this example, service1 will add at his DB the product without quantity and will send through RabbitMQ to service2 the quantity and the ID. Service2 will add to his DB and send a response through RabbitMQ. This is the RPC method.

---

## Support

If this code helped you, fell free to pay me a coffee :D
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/donate/?business=6564PGDT7G8NY&no_recurring=0&currency_code=BRL)


---

## Legal
This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at your own risk.
