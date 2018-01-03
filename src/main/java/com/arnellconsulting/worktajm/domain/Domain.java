package com.arnellconsulting.worktajm.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * In many cases an organization is only one user.
 */
@ApiModel(description = "In many cases an organization is only one user.")
@Entity
@Table(name = "domain")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "domain")
public class Domain implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the domain (required)
     */
    @NotNull
    @ApiModelProperty(value = "Name of the domain (required)", required = true)
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * 1 -> 1 (unidirectional)
     * Domain has an address (required).
     */
    @ApiModelProperty(value = "1 -> 1 (unidirectional) Domain has an address (required).")
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Address address;

    /**
     * 1 -> m (bidirectional)
     * Domain has zero or more customers.
     * Customer belongs to one domain (required).
     */
    @ApiModelProperty(value = "1 -> m (bidirectional) Domain has zero or more customers. Customer belongs to one domain (required).")
    @OneToMany(mappedBy = "domain")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Customer> customers = new HashSet<>();

    /**
     * m -> m (unidirectional many-to-many)
     * One user can be registered at many domains.
     * Natural order would be User<->Domain but can't extend User.
     */
    @ApiModelProperty(value = "m -> m (unidirectional many-to-many) One user can be registered at many domains. Natural order would be User<->Domain but can't extend User.")
    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "domain_authorized_users",
               joinColumns = @JoinColumn(name="domains_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="authorized_users_id", referencedColumnName="id"))
    private Set<User> authorizedUsers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Domain name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Address getAddress() {
        return address;
    }

    public Domain address(Address address) {
        this.address = address;
        return this;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Set<Customer> getCustomers() {
        return customers;
    }

    public Domain customers(Set<Customer> customers) {
        this.customers = customers;
        return this;
    }

    public Domain addCustomers(Customer customer) {
        this.customers.add(customer);
        customer.setDomain(this);
        return this;
    }

    public Domain removeCustomers(Customer customer) {
        this.customers.remove(customer);
        customer.setDomain(null);
        return this;
    }

    public void setCustomers(Set<Customer> customers) {
        this.customers = customers;
    }

    public Set<User> getAuthorizedUsers() {
        return authorizedUsers;
    }

    public Domain authorizedUsers(Set<User> users) {
        this.authorizedUsers = users;
        return this;
    }

    public Domain addAuthorizedUsers(User user) {
        this.authorizedUsers.add(user);
        return this;
    }

    public Domain removeAuthorizedUsers(User user) {
        this.authorizedUsers.remove(user);
        return this;
    }

    public void setAuthorizedUsers(Set<User> users) {
        this.authorizedUsers = users;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Domain domain = (Domain) o;
        if (domain.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), domain.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Domain{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
