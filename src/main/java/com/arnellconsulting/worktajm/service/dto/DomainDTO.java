package com.arnellconsulting.worktajm.service.dto;


import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the Domain entity.
 */
public class DomainDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    private Long addressId;

    private String addressAddressLine1;

    private Set<UserDTO> authorizedUsers = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public String getAddressAddressLine1() {
        return addressAddressLine1;
    }

    public void setAddressAddressLine1(String addressAddressLine1) {
        this.addressAddressLine1 = addressAddressLine1;
    }

    public Set<UserDTO> getAuthorizedUsers() {
        return authorizedUsers;
    }

    public void setAuthorizedUsers(Set<UserDTO> users) {
        this.authorizedUsers = users;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        DomainDTO domainDTO = (DomainDTO) o;
        if(domainDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), domainDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DomainDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
