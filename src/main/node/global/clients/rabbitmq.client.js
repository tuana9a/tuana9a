const amqp = require("amqplib");

class RabbitMQClient {
    constructor() {
        this.enabled = false;
    }

    async prepare(connectionString) {
        this.enabled = true;
        this.client = await amqp.connect(connectionString);
        this.channel = await this.client.createChannel();
        return this;
    }

    close() {
        if (!this.enabled) throw new Error("RabbitMQClient is not enabled");
        return this.client.close();
    }
}

const rabbitmqClient = new RabbitMQClient();

module.exports = rabbitmqClient;
