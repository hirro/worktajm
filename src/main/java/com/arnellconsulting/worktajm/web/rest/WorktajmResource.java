package com.arnellconsulting.worktajm.web.rest;

import com.arnellconsulting.worktajm.domain.TimeEntry;
import com.arnellconsulting.worktajm.domain.User;
import com.arnellconsulting.worktajm.domain.UserExtra;
import com.arnellconsulting.worktajm.repository.TimeEntryRepository;
import com.arnellconsulting.worktajm.repository.UserExtraRepository;
import com.arnellconsulting.worktajm.repository.UserRepository;
import com.arnellconsulting.worktajm.security.SecurityUtils;
import com.arnellconsulting.worktajm.service.dto.TimeEntryDTO;
import com.arnellconsulting.worktajm.service.dto.UserExtraDTO;
import com.arnellconsulting.worktajm.service.mapper.TimeEntryMapper;
import com.arnellconsulting.worktajm.service.mapper.UserExtraMapper;
import com.arnellconsulting.worktajm.web.rest.errors.InternalServerErrorException;
import com.codahale.metrics.annotation.Timed;
import com.arnellconsulting.worktajm.domain.Project;

import com.arnellconsulting.worktajm.repository.ProjectRepository;
import com.arnellconsulting.worktajm.repository.search.ProjectSearchRepository;
import com.arnellconsulting.worktajm.web.rest.errors.BadRequestAlertException;
import com.arnellconsulting.worktajm.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


/**
 * REST controller for managing Project.
 */
@RestController
@RequestMapping("/api/worktajm")
@Transactional
public class WorktajmResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

    private static final String ENTITY_NAME = "worktajm";

    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;

    private final ProjectSearchRepository projectSearchRepository;

    private final UserExtraRepository userExtraRepository;

    private final TimeEntryRepository timeEntryRepository;

    private UserExtraMapper userExtraMapper;

    private TimeEntryMapper timeEntryMapper;

    public WorktajmResource(ProjectRepository projectRepository,
                            UserRepository userRepository,
                            ProjectSearchRepository projectSearchRepository,
                            UserExtraRepository userExtraRepository,
                            TimeEntryRepository timeEntryRepository,
                            UserExtraMapper userExtraMapper,
                            TimeEntryMapper timeEntryMapper) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectSearchRepository = projectSearchRepository;
        this.userExtraRepository = userExtraRepository;
        this.timeEntryRepository = timeEntryRepository;
        this.userExtraMapper = userExtraMapper;
        this.timeEntryMapper = timeEntryMapper;
    }

    /**
     * POST  /stopProject: Stops the project/
     *
     * @param id the project id to stop
     * @return the ResponseEntity with status 201 (Created) and with body the new TimeEntryDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/stopProject/{id}")
    @Timed
    public ResponseEntity<TimeEntryDTO> stopProject(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to stop Project : {}", id);

        User user = getLoggedInUser();
        if (user == null) {
            throw new InternalServerErrorException("Not logged in");
        }

        // Check project exists
        Project project = projectRepository.findOneWithEagerRelationships(id);
        if (project == null) {
            throw new BadRequestAlertException("Bad request", ENTITY_NAME, "no such project id");
        }

        // Make sure user is member of project
        List<Long> userIdsForProject = project.getProjectMembers().stream().map(User::getId).collect(Collectors.toList());
        if (!userIdsForProject.contains(user.getId())) {
            throw new BadRequestAlertException("Bad request", ENTITY_NAME, "no authorized");
        }

        // Make sure timer is running
        UserExtra userExtra = userExtraRepository.findOne(user.getId());
        if (userExtra == null) {
            throw new BadRequestAlertException("Bad request", ENTITY_NAME, "No running time entry for user");
        }

        // Stop the running time entry and clear active timer from user extra.
        TimeEntryDTO result;
        if (userExtra.getActiveTimeEntry() == null) {
            result = null;
        } else {
            TimeEntry timeEntry = userExtra.getActiveTimeEntry();
            timeEntry.setEnd(ZonedDateTime.now());
            userExtra.setActiveTimeEntry(null);
            userExtraRepository.save(userExtra);
            timeEntryRepository.save(timeEntry);
            result = timeEntryMapper.toDto(timeEntry);
            projectSearchRepository.save(project);
        }

        // Return result
        return ResponseEntity.created(new URI("/api/worktajm/stopProject/" + id))
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, id.toString()))
            .body(result);
    }

    /**
     * POST  /stopProject: Stops the project/
     *
     * @param id the project id to stop
     * @return the ResponseEntity with status 201 (Created) and with body the new TimeEntryDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/startProject/{id}")
    @Timed
    public ResponseEntity<TimeEntryDTO> startProject(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to start Project : {}", id);

        User user = getLoggedInUser();
        if (user == null) {
            throw new InternalServerErrorException("Not logged in");
        }

        // Check project exists
        Project project = projectRepository.findOneWithEagerRelationships(id);
        if (project == null) {
            throw new BadRequestAlertException("Bad request", ENTITY_NAME, "no such project id");
        }

        // Make sure user is member of project
        List<Long> userIdsForProject = project.getProjectMembers().stream().map(User::getId).collect(Collectors.toList());
        if (!userIdsForProject.contains(user.getId())) {
            throw new BadRequestAlertException("Bad request", ENTITY_NAME, "no authorized");
        }

        // Make sure timer is not running already
        UserExtra userExtra = userExtraRepository.findOne(user.getId());
        if (userExtra == null) {
            userExtra = new UserExtra();
        } else if (userExtra.getActiveTimeEntry() != null) {
            // Stop current timer
            userExtra.getActiveTimeEntry().setEnd(ZonedDateTime.now());
            timeEntryRepository.save(userExtra.getActiveTimeEntry());
            userExtra.setActiveTimeEntry(null);
            userExtraRepository.save(userExtra);
        }

        // Start the running time entry and clear active timer from user extra.
        TimeEntry timeEntry = new TimeEntry();
        timeEntry.setUser(user);
        timeEntry.setStart(ZonedDateTime.now());
        timeEntry.setProject(project);
        userExtra.setActiveTimeEntry(timeEntry);
        userExtraRepository.save(userExtra);
        timeEntryRepository.save(timeEntry);
        TimeEntryDTO result = timeEntryMapper.toDto(timeEntry);
        projectSearchRepository.save(project);

        // Return result
        return ResponseEntity.created(new URI("/api/worktajm/stopProject/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    private User getLoggedInUser() {
        Optional<String> userLogin = SecurityUtils.getCurrentUserLogin();
        return userRepository.findOneByLogin(userLogin.get()).get();
    }
}
