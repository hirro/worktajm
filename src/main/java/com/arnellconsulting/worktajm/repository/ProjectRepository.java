package com.arnellconsulting.worktajm.repository;

import com.arnellconsulting.worktajm.domain.Domain;
import com.arnellconsulting.worktajm.domain.Project;
import com.arnellconsulting.worktajm.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.List;


/**
 * Spring Data JPA repository for the Project entity.
 *
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    /**
     * Find all projects belonging to the domain.
     */
    @Query("select p from Project p " +
        "inner join Customer c on p.belongsTo = c.id " +
        "where c.domain in (:domainIds)")
    Page<Project> findAllProjectsInDomains(@Param("domainIds") List<Domain> domainIds, Pageable pageable);

}
