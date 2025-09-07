FROM rabbitmq:4.1.3-management

# Actualizar paquetes e instalar wget
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Descargar el plugin delayed message exchange
RUN wget -O /opt/rabbitmq/plugins/rabbitmq_delayed_message_exchange-4.1.0.ez \
https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v4.1.0/rabbitmq_delayed_message_exchange-4.1.0.ez
# Crear script de inicio personalizado
RUN echo '#!/bin/bash' > /usr/local/bin/custom-entrypoint.sh && \
    echo 'set -e' >> /usr/local/bin/custom-entrypoint.sh && \
    echo 'rabbitmq-plugins enable rabbitmq_delayed_message_exchange' >> /usr/local/bin/custom-entrypoint.sh && \
    echo 'exec docker-entrypoint.sh "$@"' >> /usr/local/bin/custom-entrypoint.sh && \
    chmod +x /usr/local/bin/custom-entrypoint.sh

# Usar el script personalizado como entrypoint
ENTRYPOINT ["/usr/local/bin/custom-entrypoint.sh"]
CMD ["rabbitmq-server"]