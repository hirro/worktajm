package com.arnellconsulting.worktajm.web.rest;

import com.arnellconsulting.worktajm.domain.User;
import com.arnellconsulting.worktajm.repository.UserRepository;
import com.arnellconsulting.worktajm.security.SecurityUtils;
import com.codahale.metrics.annotation.Timed;
import com.arnellconsulting.worktajm.domain.TimeEntry;

import com.arnellconsulting.worktajm.repository.TimeEntryRepository;
import com.arnellconsulting.worktajm.repository.search.TimeEntrySearchRepository;
import com.arnellconsulting.worktajm.web.rest.errors.BadRequestAlertException;
import com.arnellconsulting.worktajm.web.rest.util.HeaderUtil;
import com.arnellconsulting.worktajm.web.rest.util.PaginationUtil;
import com.arnellconsulting.worktajm.service.dto.TimeEntryDTO;
import com.arnellconsulting.worktajm.service.mapper.TimeEntryMapper;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing TimeEntry.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TimeEntryResource {

    private final Logger log = LoggerFactory.getLogger(TimeEntryResource.class);

    private static final String ENTITY_NAME = "timeEntry";

    private final TimeEntryRepository timeEntryRepository;

    private final TimeEntryMapper timeEntryMapper;

    private final TimeEntrySearchRepository timeEntrySearchRepository;

    private final UserRepository userRepository;

    public TimeEntryResource(TimeEntryRepository timeEntryRepository, TimeEntryMapper timeEntryMapper, TimeEntrySearchRepository timeEntrySearchRepository, UserRepository userRepository) {
        this.timeEntryRepository = timeEntryRepository;
        this.timeEntryMapper = timeEntryMapper;
        this.timeEntrySearchRepository = timeEntrySearchRepository;
        this.userRepository = userRepository;
    }

    /**
     * POST  /time-entries : Create a new timeEntry.
     *
     * @param timeEntryDTO the timeEntryDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new timeEntryDTO, or with status 400 (Bad Request) if the timeEntry has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/time-entries")
    @Timed
    public ResponseEntity<TimeEntryDTO> createTimeEntry(@Valid @RequestBody TimeEntryDTO timeEntryDTO) throws URISyntaxException {
        log.debug("REST request to save TimeEntry : {}", timeEntryDTO);
        if (timeEntryDTO.getId() != null) {
            throw new BadRequestAlertException("A new timeEntry cannot already have an ID", ENTITY_NAME, "idexists");
        }

        TimeEntry timeEntry = timeEntryMapper.toEntity(timeEntryDTO);

        // Time entries are always owned by the logged in user.
        timeEntry.setUser(getLoggedInUser());

        timeEntry = timeEntryRepository.save(timeEntry);
        TimeEntryDTO result = timeEntryMapper.toDto(timeEntry);
        timeEntrySearchRepository.save(timeEntry);
        return ResponseEntity.created(new URI("/api/time-entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /time-entries : Updates an existing timeEntry.
     *
     * @param timeEntryDTO the timeEntryDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated timeEntryDTO,
     * or with status 400 (Bad Request) if the timeEntryDTO is not valid,
     * or with status 500 (Internal Server Error) if the timeEntryDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/time-entries")
    @Timed
    public ResponseEntity<TimeEntryDTO> updateTimeEntry(@Valid @RequestBody TimeEntryDTO timeEntryDTO) throws URISyntaxException {
        log.debug("REST request to update TimeEntry : {}", timeEntryDTO);
        if (timeEntryDTO.getId() == null) {
            return createTimeEntry(timeEntryDTO);
        }
        TimeEntry timeEntry = timeEntryMapper.toEntity(timeEntryDTO);

        // Only owner may update the time entry and ownership may not be changed.
        TimeEntry existingTimeEntry = timeEntryRepository.findOne(timeEntry.getId());
        if (existingTimeEntry.getUser().getId() != timeEntry.getUser().getId()) {
            throw new AccessDeniedException("Ownership manipulation detected");
        }

        // Only logged in user may update object
        if (timeEntry.getUser().getId() != getLoggedInUser().getId()) {
            throw new AccessDeniedException("Only owner may modify time entry");
        }

        timeEntry = timeEntryRepository.save(timeEntry);
        TimeEntryDTO result = timeEntryMapper.toDto(timeEntry);
        timeEntrySearchRepository.save(timeEntry);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, timeEntryDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /time-entries : get all the timeEntries.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of timeEntries in body
     */
    @GetMapping("/time-entries")
    @Timed
    public ResponseEntity<List<TimeEntryDTO>> getAllTimeEntries(Pageable pageable) {
        log.debug("REST request to get a page of TimeEntries");
        Page<TimeEntry> page = timeEntryRepository.findByUserIsCurrentUser(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/time-entries");
        return new ResponseEntity<>(timeEntryMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /time-entries/:id : get the "id" timeEntry.
     *
     * @param id the id of the timeEntryDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the timeEntryDTO, or with status 404 (Not Found)
     */
    @GetMapping("/time-entries/{id}")
    @Timed
    public ResponseEntity<TimeEntryDTO> getTimeEntry(@PathVariable Long id) {
        log.debug("REST request to get TimeEntry : {}", id);
        TimeEntry timeEntry = timeEntryRepository.findOne(id);
        TimeEntryDTO timeEntryDTO = timeEntryMapper.toDto(timeEntry);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(timeEntryDTO));
    }

    /**
     * DELETE  /time-entries/:id : delete the "id" timeEntry.
     *
     * @param id the id of the timeEntryDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/time-entries/{id}")
    @Timed
    public ResponseEntity<Void> deleteTimeEntry(@PathVariable Long id) {
        log.debug("REST request to delete TimeEntry : {}", id);
        timeEntryRepository.delete(id);
        timeEntrySearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/time-entries?query=:query : search for the timeEntry corresponding
     * to the query.
     *
     * @param query the query of the timeEntry search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/time-entries")
    @Timed
    public ResponseEntity<List<TimeEntryDTO>> searchTimeEntries(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of TimeEntries for query {}", query);
        Page<TimeEntry> page = timeEntrySearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/time-entries");
        return new ResponseEntity<>(timeEntryMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    private User getLoggedInUser() {
        Optional<String> userLogin = SecurityUtils.getCurrentUserLogin();
        return userRepository.findOneByLogin(userLogin.get()).get();
    }

}
