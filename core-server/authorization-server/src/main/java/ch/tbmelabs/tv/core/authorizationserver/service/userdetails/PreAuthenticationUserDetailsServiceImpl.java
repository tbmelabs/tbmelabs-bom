package ch.tbmelabs.tv.core.authorizationserver.service.userdetails;

import java.util.Optional;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Service;
import ch.tbmelabs.tv.core.authorizationserver.domain.User;
import ch.tbmelabs.tv.core.authorizationserver.domain.repository.UserCRUDRepository;

@Service
public class PreAuthenticationUserDetailsServiceImpl
    implements AuthenticationUserDetailsService<PreAuthenticatedAuthenticationToken> {

  private static final Logger LOGGER =
      LogManager.getLogger(PreAuthenticatedAuthenticationProviderImpl.class);

  @Autowired
  private TokenStore tokenStore;

  @Autowired
  private UserCRUDRepository userRepository;

  @Override
  public UserDetails loadUserDetails(PreAuthenticatedAuthenticationToken token) {
    String username = tokenStore.readAuthentication((String) token.getPrincipal()).getName();

    LOGGER.debug("Loading userdetails for username \"" + username + "\"");

    Optional<User> user;
    if (!(user = userRepository.findOneByUsernameIgnoreCase(username)).isPresent()) {
      throw new UsernameNotFoundException("Username " + username + " does not exist!");
    }

    return new UserDetailsImpl(user.get());
  }
}
