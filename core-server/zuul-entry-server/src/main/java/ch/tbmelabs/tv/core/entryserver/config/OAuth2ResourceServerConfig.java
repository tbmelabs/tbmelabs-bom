package ch.tbmelabs.tv.core.entryserver.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.store.redis.RedisTokenStore;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;

@Configuration
@EnableResourceServer
public class OAuth2ResourceServerConfig extends ResourceServerConfigurerAdapter {
  @Autowired
  private RedisTokenStore tokenStore;

  @Autowired
  private LoginUrlAuthenticationEntryPoint entryPoint;

  @Override
  public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
    resources.tokenStore(tokenStore).authenticationEntryPoint(entryPoint);
  }

  @Override
  public void configure(HttpSecurity http) throws Exception {
    // Allow anonymous requests to public (static) resources and
    // login/registration services
    http.authorizeRequests().antMatchers(entryPoint.getLoginFormUrl() + "/**", "/register/**").anonymous().anyRequest()
        .permitAll()

        // Deny any other requested source unless user is authenticated
        .and().authorizeRequests().anyRequest().authenticated();
  }
}