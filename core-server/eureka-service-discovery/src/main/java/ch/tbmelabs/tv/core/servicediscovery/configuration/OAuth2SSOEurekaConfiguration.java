package ch.tbmelabs.tv.core.servicediscovery.configuration;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import ch.tbmelabs.tv.shared.constants.security.UserAuthority;
import ch.tbmelabs.tv.shared.constants.spring.SpringApplicationProfile;

@Configuration
@EnableOAuth2Sso
@EnableEurekaServer
public class OAuth2SSOEurekaConfiguration extends WebSecurityConfigurerAdapter {

  private static final Logger LOGGER = LogManager.getLogger(OAuth2SSOEurekaConfiguration.class);

  @Autowired
  private Environment environment;

  @Override
  public void configure(WebSecurity web) throws Exception {
    if (environment.acceptsProfiles(SpringApplicationProfile.DEV)) {
      LOGGER.warn("Profile \"" + SpringApplicationProfile.DEV
          + "\" is active: Web request debugging is enabled!");

      web.debug(true);
    }
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // @formatter:off
    http
      
      .csrf().disable()
      
      .authorizeRequests()
        .antMatchers("/favicon.ico").permitAll()
        .antMatchers("/eureka/**").permitAll()
        .antMatchers("/public/**", "/vendor/**").permitAll()
        .anyRequest().hasAnyAuthority(UserAuthority.GANDALF, UserAuthority.SERVER_ADMIN, UserAuthority.SERVER_SUPPORT)
      
      .and().exceptionHandling()
        .accessDeniedPage("/403.html");
    // @formatter:on
  }
}
