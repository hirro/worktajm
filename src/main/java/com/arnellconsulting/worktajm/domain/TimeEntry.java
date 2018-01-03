package com.arnellconsulting.worktajm.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * The time entry that logs work on a particular project.
 * 
 * Each time entry belongs to one user.
 */
@ApiModel(description = "The time entry that logs work on a particular project. Each time entry belongs to one user.")
@Entity
@Table(name = "time_entry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "timeentry")
public class TimeEntry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Start time for the time entry (required)
     */
    @NotNull
    @ApiModelProperty(value = "Start time for the time entry (required)", required = true)
    @Column(name = "jhi_start", nullable = false)
    private ZonedDateTime start;

    /**
     * End time for the time entry (optional for running tasks)
     */
    @ApiModelProperty(value = "End time for the time entry (optional for running tasks)")
    @Column(name = "jhi_end")
    private ZonedDateTime end;

    /**
     * Optional comment
     */
    @ApiModelProperty(value = "Optional comment")
    @Column(name = "jhi_comment")
    private String comment;

    /**
     * TimeEntry belongs to one Project.
     * m -> 1 (required)
     */
    @ApiModelProperty(value = "TimeEntry belongs to one Project. m -> 1 (required)")
    @ManyToOne(optional = false)
    @NotNull
    private Project project;

    /**
     * TimeEntry belongs to one User.
     * m -> 1 (required)
     */
    @ApiModelProperty(value = "TimeEntry belongs to one User. m -> 1 (required)")
    @ManyToOne(optional = false)
    @NotNull
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getStart() {
        return start;
    }

    public TimeEntry start(ZonedDateTime start) {
        this.start = start;
        return this;
    }

    public void setStart(ZonedDateTime start) {
        this.start = start;
    }

    public ZonedDateTime getEnd() {
        return end;
    }

    public TimeEntry end(ZonedDateTime end) {
        this.end = end;
        return this;
    }

    public void setEnd(ZonedDateTime end) {
        this.end = end;
    }

    public String getComment() {
        return comment;
    }

    public TimeEntry comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Project getProject() {
        return project;
    }

    public TimeEntry project(Project project) {
        this.project = project;
        return this;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public TimeEntry user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        TimeEntry timeEntry = (TimeEntry) o;
        if (timeEntry.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), timeEntry.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TimeEntry{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            ", end='" + getEnd() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
