package com.arnellconsulting.worktajm.service.dto;


import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the UserExtra entity.
 */
public class UserExtraDTO implements Serializable {

    private Long id;

    private String phone;

    private Long userId;

    private Long activeTimeEntryId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getActiveTimeEntryId() {
        return activeTimeEntryId;
    }

    public void setActiveTimeEntryId(Long timeEntryId) {
        this.activeTimeEntryId = timeEntryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        UserExtraDTO userExtraDTO = (UserExtraDTO) o;
        if(userExtraDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userExtraDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserExtraDTO{" +
            "id=" + getId() +
            ", phone='" + getPhone() + "'" +
            "}";
    }
}
