package com.arnellconsulting.worktajm.repository;

import com.arnellconsulting.worktajm.domain.Domain;
import com.arnellconsulting.worktajm.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Domain entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DomainRepository extends JpaRepository<Domain, Long> {
    @Query("select distinct domain from Domain domain left join fetch domain.authorizedUsers")
    List<Domain> findAllWithEagerRelationships();

    @Query("select domain from Domain domain left join fetch domain.authorizedUsers where domain.id =:id")
    Domain findOneWithEagerRelationships(@Param("id") Long id);

    /**
     * Find all domains permitted for user.
     * @param user
     * @param pageable
     * @return
     */
    Page<Domain> findAllByAuthorizedUsersIs(User user, Pageable pageable);

}

