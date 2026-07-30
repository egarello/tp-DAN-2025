package edu.utn.frsf.isi.dan.eureka;

import com.netflix.eureka.registry.PeerAwareInstanceRegistry;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.binder.MeterBinder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DanEurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DanEurekaServerApplication.class, args);
    }

    @Bean
    MeterBinder eurekaRegistrySize(PeerAwareInstanceRegistry eurekaRegistry) {
        return meterRegistry -> Gauge.builder(
                        "eureka.server.registry.size",
                        eurekaRegistry,
                        registry -> registry.getApplications().size())
                .description("Number of applications registered in Eureka")
                .register(meterRegistry);
    }
}
