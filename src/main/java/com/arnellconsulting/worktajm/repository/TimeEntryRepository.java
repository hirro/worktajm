package com.arnellconsulting.worktajm.repository;

import com.arnellconsulting.worktajm.domain.TimeEntry;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the TimeEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    @Query("select time_entry from TimeEntry time_entry where time_entry.user.login = ?#{principal.username}")
    List<TimeEntry> findByUserIsCurrentUser();

}
