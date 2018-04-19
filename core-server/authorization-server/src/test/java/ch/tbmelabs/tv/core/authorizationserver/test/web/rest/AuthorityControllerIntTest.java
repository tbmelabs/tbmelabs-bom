package ch.tbmelabs.tv.core.authorizationserver.test.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import ch.tbmelabs.tv.core.authorizationserver.test.AbstractOAuth2AuthorizationServerContextAwareTest;
import ch.tbmelabs.tv.shared.constants.security.UserAuthority;

public class AuthorityControllerIntTest extends AbstractOAuth2AuthorizationServerContextAwareTest {
  @Value("${spring.data.rest.base-path}/authorities")
  private String authorityEndpoint;

  @Autowired
  private MockMvc mockMvc;

  @Test
  @WithMockUser(username = "AuthorityControllerIntTestUser",
      authorities = {UserAuthority.SERVER_ADMIN})
  public void getAuthoritiesEndpointIsAccessibleToServerAdmins() throws Exception {
    mockMvc.perform(get(authorityEndpoint)).andDo(print())
        .andExpect(status().is(HttpStatus.OK.value()));
  }

  @Test
  @WithMockUser(username = "AuthorityControllerIntTestUser",
      authorities = {UserAuthority.SERVER_SUPPORT})
  public void getAuthoritiesEndpointIsNotAccessibleToNonServerAdmins() throws Exception {
    mockMvc.perform(get(authorityEndpoint)).andDo(print())
        .andExpect(status().is(HttpStatus.FORBIDDEN.value()));
  }
}