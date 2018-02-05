package com.arnellconsulting.worktajm.repository;

import com.arnellconsulting.worktajm.domain.Project;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Project entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("select distinct project from Project project left join fetch project.projectMembers")
    List<Project> findAllWithEagerRelationships();

    @Query("select project from Project project left join fetch project.projectMembers where project.id =:id")
    Project findOneWithEagerRelationships(@Param("id") Long id);

}
