package com.arnellconsulting.worktajm.web.rest;

import com.arnellconsulting.worktajm.domain.Domain;
import com.arnellconsulting.worktajm.domain.User;
import com.arnellconsulting.worktajm.repository.DomainRepository;
import com.arnellconsulting.worktajm.repository.search.DomainSearchRepository;
import com.arnellconsulting.worktajm.security.AuthoritiesConstants;
import com.arnellconsulting.worktajm.service.UserService;
import com.arnellconsulting.worktajm.service.dto.DomainDTO;
import com.arnellconsulting.worktajm.service.mapper.DomainMapper;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * REST controller for managing Domain.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DomainResource {

    private final Logger log = LoggerFactory.getLogger(DomainResource.class);

    private static final String ENTITY_NAME = "domain";

    private final DomainRepository domainRepository;

    private final DomainMapper domainMapper;

    private final DomainSearchRepository domainSearchRepository;

    private final UserService userService;

    public DomainResource(DomainRepository domainRepository, DomainMapper domainMapper, DomainSearchRepository domainSearchRepository, UserService userService) {
        this.domainRepository = domainRepository;
        this.domainMapper = domainMapper;
        this.domainSearchRepository = domainSearchRepository;
        this.userService = userService;
    }

    /**
     * POST  /domains : Create a new domain.
     *
     * @param domainDTO the domainDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new domainDTO, or with status 400 (Bad Request) if the domain has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/domains")
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER})
    @Timed
    public ResponseEntity<DomainDTO> createDomain(@Valid @RequestBody DomainDTO domainDTO,
                                                  Principal principal)
        throws URISyntaxException
    {
        log.debug("REST request to save Domain : {}", domainDTO);
        if (domainDTO.getId() != null) {
            throw new BadRequestAlertException("A new domain cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Domain domain = domainMapper.toEntity(domainDTO);

        // Add current user as authorized
        User user = userService.getLoggedInUser();
        domain.addAuthorizedUsers(user);

        domain = domainRepository.save(domain);
        DomainDTO result = domainMapper.toDto(domain);
        domainSearchRepository.save(domain);
        return ResponseEntity.created(new URI("/api/domains/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /domains : Updates an existing domain.
     *
     * @param domainDTO the domainDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated domainDTO,
     * or with status 400 (Bad Request) if the domainDTO is not valid,
     * or with status 500 (Internal Server Error) if the domainDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/domains")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER})
    public ResponseEntity<DomainDTO> updateDomain(@Valid @RequestBody DomainDTO domainDTO) throws URISyntaxException {
        log.debug("REST request to update Domain : {}", domainDTO);

        // Check user has permission to access domain
        Domain existingDomain = domainRepository.findOne(domainDTO.getId());
        if (existingDomain == null) {
            return ResponseEntity.notFound().build();
        }
        checkAccessToDomain(existingDomain);

        // Update
        Domain domain = domainMapper.toEntity(domainDTO);

        // Add current user as authorized
        User user = userService.getLoggedInUser();
        domain.addAuthorizedUsers(user);

        domain = domainRepository.save(domain);
        DomainDTO result = domainMapper.toDto(domain);
        domainSearchRepository.save(domain);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, domainDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /domains : get all the domains.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of domains in body
     */
    @GetMapping("/domains")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER})
    public ResponseEntity<List<DomainDTO>> getAllDomains(Pageable pageable) {
        log.debug("REST request to get a page of Domains");
        Optional<User> user = this.userService.getUserWithAuthorities();
        Page<Domain> page = domainRepository.findAllByAuthorizedUsersIs(user.get(), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/domains");
        return new ResponseEntity<>(domainMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /domains/:id : get the "id" domain.
     *
     * @param id the id of the domainDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the domainDTO, or with status 404 (Not Found)
     */
    @GetMapping("/domains/{id}")
    @Timed
    @Secured({AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER})
    public ResponseEntity<DomainDTO> getDomain(@PathVariable Long id) {
        log.debug("REST request to get Domain : {}", id);

        Domain domain = domainRepository.findOneWithEagerRelationships(id);
        if (domain == null) {
            return ResponseEntity.notFound().build();
        }
        // Check user has permission to access domain
        checkAccessToDomain(domain);

        DomainDTO domainDTO = domainMapper.toDto(domain);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(domainDTO));
    }

    /**
     * DELETE  /domains/:id : delete the "id" domain.
     *
     * @param id the id of the domainDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/domains/{id}")
    @Timed
    @Secured(AuthoritiesConstants.ADMIN)
    public ResponseEntity<Void> deleteDomain(@PathVariable Long id) {
        log.debug("REST request to delete Domain : {}", id);

        // Check user has permission to access domain
        Domain domain = domainRepository.findOne(id);
        if (domain == null) {
            return ResponseEntity.notFound().build();
        }
        checkAccessToDomain(domain);

        domainRepository.delete(id);
        domainSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/domains?query=:query : search for the domain corresponding
     * to the query.
     *
     * @param query the query of the domain search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/domains")
    @Timed
    public ResponseEntity<List<DomainDTO>> searchDomains(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Domains for query {}", query);
        Page<Domain> page = domainSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/domains");
        return new ResponseEntity<>(domainMapper.toDto(page.getContent()), headers, HttpStatus.OK);
    }

    private void checkAccessToDomain(Domain domain) {

        // Must find user
        Optional<User> user = this.userService.getUserWithAuthorities();
        if (!user.isPresent()) {
            throw new AccessDeniedException("User not found");
        }

        // Make sure user has access to domain
        if (!domain.isUserIdAuthorized(user.get().getId())) {
            throw new AccessDeniedException("User is not allowed to access domain");
        }
    }

}
