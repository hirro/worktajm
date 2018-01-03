package com.arnellconsulting.worktajm.repository;

import com.arnellconsulting.worktajm.domain.Domain;
import com.arnellconsulting.worktajm.domain.User;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Domain entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DomainRepository extends JpaRepository<Domain, Long> {
    @Query("select distinct domain from Domain domain left join fetch domain.members")
    List<Domain> findAllWithEagerRelationships();

    @Query("select domain from Domain domain left join fetch domain.members where domain.id =:id")
    Domain findOneWithEagerRelationships(@Param("id") Long id);

    List<Domain> findAllByMembersEquals(User user);
}
