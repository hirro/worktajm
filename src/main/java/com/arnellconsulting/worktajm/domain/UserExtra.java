package com.arnellconsulting.worktajm.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.Objects;

/**
 * Addtional information for our users.
 */
@ApiModel(description = "Addtional information for our users.")
@Entity
@Table(name = "user_extra")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "userextra")
public class UserExtra implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone")
    private String phone;

    /**
     * Extended User object according to:
     * http:
     */
    @ApiModelProperty(value = "Extended User object according to: http:")
    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    /**
     * User may have one active time entry.
     * 1 -> 1
     */
    @ApiModelProperty(value = "User may have one active time entry. 1 -> 1")
    @OneToOne
    @JoinColumn(unique = true)
    private TimeEntry activeTimeEntry;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public UserExtra phone(String phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public User getUser() {
        return user;
    }

    public UserExtra user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TimeEntry getActiveTimeEntry() {
        return activeTimeEntry;
    }

    public UserExtra activeTimeEntry(TimeEntry timeEntry) {
        this.activeTimeEntry = timeEntry;
        return this;
    }

    public void setActiveTimeEntry(TimeEntry timeEntry) {
        this.activeTimeEntry = timeEntry;
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
        UserExtra userExtra = (UserExtra) o;
        if (userExtra.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userExtra.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserExtra{" +
            "id=" + getId() +
            ", phone='" + getPhone() + "'" +
            "}";
    }
}
