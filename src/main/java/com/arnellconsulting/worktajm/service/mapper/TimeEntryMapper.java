package com.arnellconsulting.worktajm.service.mapper;

import com.arnellconsulting.worktajm.domain.*;
import com.arnellconsulting.worktajm.service.dto.TimeEntryDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity TimeEntry and its DTO TimeEntryDTO.
 */
@Mapper(componentModel = "spring", uses = {ProjectMapper.class, UserMapper.class})
public interface TimeEntryMapper extends EntityMapper<TimeEntryDTO, TimeEntry> {

    @Mapping(source = "project.id", target = "projectId")
    @Mapping(source = "project.name", target = "projectName")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.email", target = "userEmail")
    TimeEntryDTO toDto(TimeEntry timeEntry);

    @Mapping(source = "projectId", target = "project")
    @Mapping(source = "userId", target = "user")
    TimeEntry toEntity(TimeEntryDTO timeEntryDTO);

    default TimeEntry fromId(Long id) {
        if (id == null) {
            return null;
        }
        TimeEntry timeEntry = new TimeEntry();
        timeEntry.setId(id);
        return timeEntry;
    }
}
