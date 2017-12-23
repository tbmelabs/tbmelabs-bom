package ch.tbmelabs.tv.core.authorizationserver.configuration;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import ch.tbmelabs.tv.core.authorizationserver.security.login.OAuth2LoginFailureHandler;
import ch.tbmelabs.tv.core.authorizationserver.security.login.OAuth2LoginSuccessHandler;
import ch.tbmelabs.tv.core.authorizationserver.security.login.OAuth2LoginUrlAuthenticationEntryPoint;
import ch.tbmelabs.tv.shared.constants.spring.SpringApplicationProfile;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
  @Autowired
  @Qualifier("authenticationManagerBean")
  private AuthenticationManager authenticationManager;

  @Autowired
  private Environment environment;

  @Autowired
  private OAuth2LoginFailureHandler loginFailureHandler;

  @Autowired
  private OAuth2LoginSuccessHandler loginSuccessHandler;

  @Override
  protected AuthenticationManager authenticationManager() throws Exception {
    return authenticationManager;
  }

  @Override
  public void configure(WebSecurity web) throws Exception {
    if (Arrays.asList(environment.getActiveProfiles()).contains(SpringApplicationProfile.DEV)) {
      web.debug(true);
    }
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // @formatter:off
    http
        
        .csrf().disable()
    
        .authorizeRequests().antMatchers("/", "/public/**").permitAll()
          .antMatchers("/signup/**").permitAll()
          .anyRequest().authenticated()
        
        .and().formLogin().loginProcessingUrl("/")
        .failureHandler(loginFailureHandler)
        .successHandler(loginSuccessHandler)
        .and().exceptionHandling().authenticationEntryPoint(new OAuth2LoginUrlAuthenticationEntryPoint("/"));
    // @formatter:on
  }
}