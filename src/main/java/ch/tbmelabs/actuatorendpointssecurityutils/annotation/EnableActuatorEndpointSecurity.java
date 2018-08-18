package ch.tbmelabs.actuatorendpointssecurityutils.annotation;

import ch.tbmelabs.tv.actuatorendpointssecurityutils.configuration.ActuatorEndpointSecurityConfiguration;
import ch.tbmelabs.tv.actuatorendpointssecurityutils.configuration.ApplicationProperties;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.context.annotation.Import;

@Target(value = ElementType.TYPE)
@Retention(value = RetentionPolicy.RUNTIME)
@Import({ApplicationProperties.class, ActuatorEndpointSecurityConfiguration.class})
public @interface EnableActuatorEndpointSecurity {

}
