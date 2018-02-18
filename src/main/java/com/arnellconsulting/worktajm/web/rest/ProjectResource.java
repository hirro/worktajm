package com.arnellconsulting.worktajm.web.rest;

import com.arnellconsulting.worktajm.domain.Project;
import com.arnellconsulting.worktajm.domain.User;
import com.arnellconsulting.worktajm.repository.ProjectRepository;
import com.arnellconsulting.worktajm.repository.UserRepository;
import com.arnellconsulting.worktajm.repository.search.ProjectSearchRepository;
import com.arnellconsulting.worktajm.service.UserService;
import com.arnellconsulting.worktajm.service.dto.ProjectDTO;
import com.arnellconsulting.worktajm.service.mapper.ProjectMapper;
import com.arnellconsulting.worktajm.web.rest.errors.BadRequestAlertException;
import com.arnellconsulting.worktajm.web.rest.util.HeaderUtil;
import com.arnellconsulting.worktajm.web.rest.util.PaginationUtil;
import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Project.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProjectResource {

    private final Logger log = LoggerFactory.getLogger(ProjectResource.class);

    private static final String ENTITY_NAME = "project";

    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;

    private final ProjectMapper projectMapper;

    private final ProjectSearchRepository projectSearchRepository;

    private final UserService userService;

    public ProjectResource(ProjectRepository projectRepository, UserRepository userRepository, ProjectMapper projectMapper, ProjectSearchRepository projectSearchRepository, UserService userService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMapper = projectMapper;
        this.projectSearchRepository = projectSearchRepository;
        this.userService = userService;
    }

    /**
     * POST  /projects : Create a new project.
     *
     * @param projectDTO the projectDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new projectDTO, or with status 400 (Bad Request) if the project has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/projects")
    @Timed
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO projectDTO) throws URISyntaxException {
        log.debug("REST request to save Project : {}", projectDTO);
        if (projectDTO.getId() != null) {
            throw new BadRequestAlertException("A new project cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Project project = projectMapper.toEntity(projectDTO);

        // Add current user as authorized
        User user = userService.getLoggedInUser();
        project.addProjectMembers(user);

        project = projectRepository.save(project);
        ProjectDTO result = projectMapper.toDto(project);
        projectSearchRepository.save(project);
        return ResponseEntity.created(new URI("/api/projects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /projects : Updates an existing project.
     *
     * @param projectDTO the projectDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated projectDTO,
     * or with status 400 (Bad Request) if the projectDTO is not valid,
     * or with status 500 (Internal Server Error) if the projectDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/projects")
    @Timed
    public ResponseEntity<ProjectDTO> updateProject(@Valid @RequestBody ProjectDTO projectDTO) throws URISyntaxException {
        log.debug("REST request to update Project : {}", projectDTO);
        if (projectDTO.getId() == null) {
            return createProject(projectDTO);
        }
        Project project = projectMapper.toEntity(projectDTO);

        // Add current user as authorized
        User user = userService.getLoggedInUser();
        project.addProjectMembers(user);

        project = projectRepository.save(project);
        ProjectDTO result = projectMapper.toDto(project);
        projectSearchRepository.save(project);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, projectDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /projects : get all the projects.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of projects in body
     */
    @GetMapping("/projects")
    @Timed
    public ResponseEntity<List<ProjectDTO>> getAllProjects(Pageable pageable) {
        log.debug("REST request to get a page of Projects");

        // Find currently logged in user
        List<User> users = Arrays.asList(userService.getLoggedInUser());

        Page<Project> page = projectRepository.findAllByProjectMembersIn(users, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/projects");
        return new ResponseEntity<>(projectMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /projects/:id : get the "id" project.
     *
     * @param id the id of the projectDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the projectDTO, or with status 404 (Not Found)
     */
    @GetMapping("/projects/{id}")
    @Timed
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Long id) {
        log.debug("REST request to get Project : {}", id);
        final Project project = projectRepository.findOneWithEagerRelationships(id);
        final ProjectDTO projectDTO;

        // Only projects that is authorized to the logged in user may be returned
        if ((project != null) && project.getProjectMembers().contains(userService.getLoggedInUser())) {
            projectDTO = projectMapper.toDto(project);
        } else {
            projectDTO = null;
        }

        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(projectDTO));
    }

    /**
     * DELETE  /projects/:id : delete the "id" project.
     *
     * @param id the id of the projectDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/projects/{id}")
    @Timed
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        log.debug("REST request to delete Project : {}", id);

        Project project = projectRepository.findOne(id);
        if (isAuthorized(project)) {
            projectRepository.delete(id);
            projectSearchRepository.delete(id);
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * SEARCH  /_search/projects?query=:query : search for the project corresponding
     * to the query.
     *
     * @param query the query of the project search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/projects")
    @Timed
    public ResponseEntity<List<ProjectDTO>> searchProjects(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Projects for query {}", query);
        Page<Project> page = projectSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/projects");
        return new ResponseEntity<>(projectMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    private boolean isAuthorized(final Project project) {
        User currentUser = userService.getLoggedInUser();
        if ((project != null) && (project.getProjectMembers() != null)) {
            for (User u : project.getProjectMembers()) {
                if (u.getLogin().equalsIgnoreCase(currentUser.getLogin())) {
                    return true;
                }
            }
        }
        return false;
    }
}
