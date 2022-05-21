const amqp = require("amqplib");

class RabbitMQClient {
    async prepare(connectionString) {
        this.client = await amqp.connect(connectionString);
        this.channel = await this.client.createChannel();
        return this;
    }

    getChannel() {
        return this.channel;
    }

    close() {
        return this.client.close();
    }
}

module.exports = RabbitMQClient;
