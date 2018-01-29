package com.arnellconsulting.worktajm.repository;

import com.arnellconsulting.worktajm.domain.TimeEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.Date;

/**
 * Spring Data JPA repository for the TimeEntry entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    @Query("select time_entry from TimeEntry time_entry where time_entry.user.login = ?#{principal.username}")
    Page<TimeEntry> findByUserIsCurrentUser(Pageable pageable);

    @Query("select time_entry from TimeEntry time_entry where time_entry.user.login = ?#{principal.username} and time_entry.start between :from and :to")
    Page<TimeEntry> findByUserIsCurrentUserBetween(@Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to, Pageable pageable);

}
