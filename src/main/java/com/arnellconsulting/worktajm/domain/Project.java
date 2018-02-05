package com.arnellconsulting.worktajm.domain;

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
 * The project associated with a time entry.
 * 
 * Each project belongs to either an user or an organization.
 */
@ApiModel(description = "The project associated with a time entry. Each project belongs to either an user or an organization.")
@Entity
@Table(name = "project")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "project")
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the project (required)
     */
    @NotNull
    @ApiModelProperty(value = "Name of the project (required)", required = true)
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Description of the project (optional)
     */
    @ApiModelProperty(value = "Description of the project (optional)")
    @Column(name = "description")
    private String description;

    /**
     * Hourly rate of the project (optional)
     */
    @ApiModelProperty(value = "Hourly rate of the project (optional)")
    @Column(name = "hourly_rate")
    private Float hourlyRate;

    /**
     * m -> m (unidirectional many-to-many)
     * One project may have one or more (global) users.
     * One user (global) may be authorized to register time on zero or more projects.
     * Natural order would be User<->Project but can't extend User.
     * Note: In order to add a user to a project, it should be authorized in the domain.
     */
    @ApiModelProperty(value = "m -> m (unidirectional many-to-many) One project may have one or more (global) users. One user (global) may be authorized to register time on zero or more projects. Natural order would be User<->Project but can't extend User. Note: In order to add a user to a project, it should be authorized in the domain.")
    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "project_project_members",
               joinColumns = @JoinColumn(name="projects_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="project_members_id", referencedColumnName="id"))
    private Set<User> projectMembers = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    private Customer customer;

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

    public Project name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public Project description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getHourlyRate() {
        return hourlyRate;
    }

    public Project hourlyRate(Float hourlyRate) {
        this.hourlyRate = hourlyRate;
        return this;
    }

    public void setHourlyRate(Float hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public Set<User> getProjectMembers() {
        return projectMembers;
    }

    public Project projectMembers(Set<User> users) {
        this.projectMembers = users;
        return this;
    }

    public Project addProjectMembers(User user) {
        this.projectMembers.add(user);
        return this;
    }

    public Project removeProjectMembers(User user) {
        this.projectMembers.remove(user);
        return this;
    }

    public void setProjectMembers(Set<User> users) {
        this.projectMembers = users;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Project customer(Customer customer) {
        this.customer = customer;
        return this;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
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
        Project project = (Project) o;
        if (project.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), project.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Project{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", hourlyRate=" + getHourlyRate() +
            "}";
    }
}
