package ch.tbmelabs.tv.authenticationserver.resource.association.clientgranttype;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sun.istack.internal.NotNull;

import ch.tbmelabs.tv.authenticationserver.resource.NicelyDocumentedJDBCResource;
import ch.tbmelabs.tv.authenticationserver.resource.client.Client;
import ch.tbmelabs.tv.authenticationserver.resource.client.GrantType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "client_has_grant_types")
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties(ignoreUnknown = true)
@IdClass(ClientGrantTypeAssociationId.class)
public class ClientGrantTypeAssociation extends NicelyDocumentedJDBCResource {
  @Transient
  private static final long serialVersionUID = 1L;

  @Id
  @NotNull
  @Column(name = "client_id")
  private Long clientId;

  @Id
  @NotNull
  @Column(name = "client_grant_type_id")
  private Long clientGrantTypeId;

  @JoinColumn(insertable = false, updatable = false)
  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
  @PrimaryKeyJoinColumn(name = "client_id", referencedColumnName = "id")
  private Client client;

  @JoinColumn(name = "client_grant_type_id", insertable = false, updatable = false)
  @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
  @PrimaryKeyJoinColumn(name = "client_grant_type_id", referencedColumnName = "id")
  private GrantType grantType;
}