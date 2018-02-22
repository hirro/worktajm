package com.arnellconsulting.worktajm.web.rest;

import com.arnellconsulting.worktajm.domain.User;
import com.arnellconsulting.worktajm.repository.UserRepository;
import com.arnellconsulting.worktajm.security.SecurityUtils;
import com.codahale.metrics.annotation.Timed;
import com.arnellconsulting.worktajm.domain.UserExtra;

import com.arnellconsulting.worktajm.repository.UserExtraRepository;
import com.arnellconsulting.worktajm.repository.search.UserExtraSearchRepository;
import com.arnellconsulting.worktajm.web.rest.util.HeaderUtil;
import com.arnellconsulting.worktajm.service.dto.UserExtraDTO;
import com.arnellconsulting.worktajm.service.mapper.UserExtraMapper;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * REST controller for managing UserExtra.
 */
@RestController
@RequestMapping("/api")
public class UserExtraResource {

    private final Logger log = LoggerFactory.getLogger(UserExtraResource.class);

    private static final String ENTITY_NAME = "userExtra";

    private final UserRepository userRepository;

    private final UserExtraRepository userExtraRepository;

    private final UserExtraMapper userExtraMapper;

    private final UserExtraSearchRepository userExtraSearchRepository;

    public UserExtraResource(UserRepository userRepository, UserExtraRepository userExtraRepository, UserExtraMapper userExtraMapper, UserExtraSearchRepository userExtraSearchRepository) {
        this.userRepository = userRepository;
        this.userExtraRepository = userExtraRepository;
        this.userExtraMapper = userExtraMapper;
        this.userExtraSearchRepository = userExtraSearchRepository;
    }

    /**
     * PUT  /user-extras : Updates an existing userExtra.
     *
     * @param userExtraDTO the userExtraDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated userExtraDTO,
     * or with status 400 (Bad Request) if the userExtraDTO is not valid,
     * or with status 500 (Internal Server Error) if the userExtraDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-extras")
    @Timed
    public ResponseEntity<UserExtraDTO> updateUserExtra(@RequestBody UserExtraDTO userExtraDTO) throws URISyntaxException {
        log.debug("REST request to update UserExtra : {}", userExtraDTO);
        UserExtraDTO result;

        // Check: Must have id
        if (userExtraDTO.getId() == null) {
            log.warn("Tried to update user extra with missing id");
            return ResponseEntity.notFound().build();
        }

        // Check: Must be logged in
        Optional<User> loggedInUser = getLoggedInUser();
        if (!loggedInUser.isPresent()) {
            log.warn("Attempted to update user extra while not being logged in");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Check: Must have user extra
        UserExtra userExtraInDb = userExtraRepository.findOne(userExtraDTO.getId());
        if (userExtraInDb == null) {
            log.warn("Attempted to update user extra while not being logged in");
            return ResponseEntity.notFound().build();
        }

        // Check: May only modify user extra owned by itself
        if (userExtraInDb.getId() != userExtraInDb.getId()) {
            log.warn("Tried is modify user extra for other user. Violating user: {}", loggedInUser.get().getLogin());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            UserExtra userExtra = userExtraMapper.toEntity(userExtraDTO);

            // Copy new values from received object to database object
            userExtraInDb.copyFrom(userExtra);
            result = userExtraMapper.toDto(userExtraRepository.save(userExtraInDb));
            userExtraSearchRepository.save(userExtraInDb);
            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, userExtraDTO.getId().toString()))
                .body(result);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET  /user-extras/
     *
     * @return the ResponseEntity with status 200 (OK) and with body the userExtraDTO, or with status 404 (Not Found)
     */
    @GetMapping("/user-extras")
    @Timed
    public ResponseEntity<UserExtraDTO> getUserExtra() {
        log.debug("REST request to get UserExtra");
        UserExtraDTO userExtraDTO;
        try {
            Optional<User> user = getLoggedInUser();
            Optional<UserExtra> userExtraInDb = userExtraRepository.findUserExtraByUser(user.get());
            userExtraDTO = userExtraMapper.toDto(userExtraInDb.get());
            return ResponseUtil.wrapOrNotFound(Optional.ofNullable(userExtraDTO));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }

    private Optional<User> getLoggedInUser() {
        Optional<String> userLogin = SecurityUtils.getCurrentUserLogin();
        if (userLogin.isPresent()) {
            String resolvedLogin = userLogin.get().toLowerCase();
            return userRepository.findOneByLogin(resolvedLogin);
        }
        return Optional.empty();
    }
}
