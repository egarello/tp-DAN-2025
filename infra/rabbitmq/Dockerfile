FROM rabbitmq:4.1.3-management

RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

RUN wget -O /opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange-4.1.0.ez \
    https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v4.1.0/rabbitmq_delayed_message_exchange-4.1.0.ez

RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange