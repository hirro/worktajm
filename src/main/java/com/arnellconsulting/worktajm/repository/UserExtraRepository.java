package com.arnellconsulting.worktajm.repository;

import com.arnellconsulting.worktajm.domain.User;
import com.arnellconsulting.worktajm.domain.UserExtra;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

import java.util.Optional;


/**
 * Spring Data JPA repository for the UserExtra entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserExtraRepository extends JpaRepository<UserExtra, Long> {

    Optional<UserExtra> findUserExtraByUser(User user);
}
