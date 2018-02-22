package com.arnellconsulting.worktajm.web.rest;

import com.arnellconsulting.worktajm.WorktajmApp;

import com.arnellconsulting.worktajm.domain.*;
import com.arnellconsulting.worktajm.repository.TimeEntryRepository;
import com.arnellconsulting.worktajm.repository.UserRepository;
import com.arnellconsulting.worktajm.repository.search.TimeEntrySearchRepository;
import com.arnellconsulting.worktajm.service.UserService;
import com.arnellconsulting.worktajm.service.dto.TimeEntryDTO;
import com.arnellconsulting.worktajm.service.mapper.TimeEntryMapper;
import com.arnellconsulting.worktajm.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.arnellconsulting.worktajm.domain.TimeEntry_.project;
import static com.arnellconsulting.worktajm.web.rest.TestUtil.sameInstant;
import static com.arnellconsulting.worktajm.web.rest.TestUtil.createFormattingConversionService;
import static com.arnellconsulting.worktajm.web.rest.UserResourceIntTest.USER_A_LOGIN;
import static com.arnellconsulting.worktajm.web.rest.UserResourceIntTest.USER_B_LOGIN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TimeEntryResource REST controller.
 *
 * @see TimeEntryResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = WorktajmApp.class)
public class TimeEntryResourceIntTest {

    private static final ZonedDateTime DEFAULT_START = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    @Autowired
    private TimeEntryRepository timeEntryRepository;

    @Autowired
    private TimeEntryMapper timeEntryMapper;

    @Autowired
    private TimeEntrySearchRepository timeEntrySearchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private UserService userService;

    @Autowired
    private EntityManager em;

    private MockMvc restTimeEntryMockMvc;

    private TimeEntry timeEntry;
    private User userA;
    private User userB;
    private Domain domain;
    private Customer customer;
    private Project project;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TimeEntryResource timeEntryResource = new TimeEntryResource(timeEntryRepository, timeEntryMapper, timeEntrySearchRepository, userRepository, userService);
        this.restTimeEntryMockMvc = MockMvcBuilders.standaloneSetup(timeEntryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
        userA = userRepository.findOneByLogin(USER_A_LOGIN).get();
        userB = userRepository.findOneByLogin(USER_B_LOGIN).get();
        timeEntry = createEntity(null);
        setupEntities();
    }

    private void setupEntities() {
        // Create domain
        domain = DomainResourceIntTest.createEntity(null);
        domain.getAuthorizedUsers().add(userA);
        em.persist(domain);

        // Create customer
        customer = CustomerResourceIntTest.createEntity(null);
        customer.setDomain(domain);
        em.persist(customer);

        // Define project
        project = ProjectResourceIntTest.createEntity(null);
        project.setCustomer(customer);
        project.getProjectMembers().add(userA);
        em.persist(project);
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TimeEntry createEntity(EntityManager em) {
        TimeEntry timeEntry = new TimeEntry()
            .start(DEFAULT_START)
            .end(DEFAULT_END)
            .comment(DEFAULT_COMMENT);
        return timeEntry;
    }

    @Before
    public void initTest() {
        userA = userRepository.findOneByLogin(USER_A_LOGIN).get();
        userB = userRepository.findOneByLogin(USER_B_LOGIN).get();
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void createTimeEntry() throws Exception {

        // Initialize the database
        userRepository.saveAndFlush(userA);
        timeEntry.setUser(userA);
        timeEntry.setProject(project);
        em.detach(timeEntry);

        int databaseSizeBeforeCreate = timeEntryRepository.findAll().size();

        // Create the TimeEntry
        TimeEntryDTO timeEntryDTO = timeEntryMapper.toDto(timeEntry);
        restTimeEntryMockMvc.perform(post("/api/time-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(timeEntryDTO)))
            .andExpect(status().isCreated());

        // Validate the TimeEntry in the database
        List<TimeEntry> timeEntryList = timeEntryRepository.findAll();
        assertThat(timeEntryList).hasSize(databaseSizeBeforeCreate + 1);
        TimeEntry testTimeEntry = timeEntryList.get(timeEntryList.size() - 1);
        assertThat(testTimeEntry.getStart()).isEqualTo(DEFAULT_START);
        assertThat(testTimeEntry.getEnd()).isEqualTo(DEFAULT_END);
        assertThat(testTimeEntry.getComment()).isEqualTo(DEFAULT_COMMENT);

        // Validate the TimeEntry in Elasticsearch
        TimeEntry timeEntryEs = timeEntrySearchRepository.findOne(testTimeEntry.getId());
        assertThat(testTimeEntry.getStart()).isEqualTo(testTimeEntry.getStart());
        assertThat(testTimeEntry.getEnd()).isEqualTo(testTimeEntry.getEnd());
        assertThat(timeEntryEs).isEqualToIgnoringGivenFields(testTimeEntry, "start", "end");
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void createTimeEntryWithExistingId() throws Exception {
        timeEntry.setProject(project);
        timeEntry.setUser(userA);

        int databaseSizeBeforeCreate = timeEntryRepository.findAll().size();

        // Create the TimeEntry with an existing ID
        timeEntry.setId(1L);
        TimeEntryDTO timeEntryDTO = timeEntryMapper.toDto(timeEntry);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTimeEntryMockMvc.perform(post("/api/time-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(timeEntryDTO)))
            .andExpect(status().isBadRequest());

        // Validate the TimeEntry in the database
        List<TimeEntry> timeEntryList = timeEntryRepository.findAll();
        assertThat(timeEntryList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void checkStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = timeEntryRepository.findAll().size();
        // set the field null
        timeEntry.setStart(null);

        // Create the TimeEntry, which fails.
        TimeEntryDTO timeEntryDTO = timeEntryMapper.toDto(timeEntry);

        restTimeEntryMockMvc.perform(post("/api/time-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(timeEntryDTO)))
            .andExpect(status().isBadRequest());

        List<TimeEntry> timeEntryList = timeEntryRepository.findAll();
        assertThat(timeEntryList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void getAllTimeEntries() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        timeEntry.setUser(userA);
        timeEntry.setProject(project);
        timeEntryRepository.saveAndFlush(timeEntry);

        // Get all the timeEntryList
        restTimeEntryMockMvc.perform(get("/api/time-entries?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(timeEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(sameInstant(DEFAULT_START))))
            .andExpect(jsonPath("$.[*].end").value(hasItem(sameInstant(DEFAULT_END))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())));
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void getTimeEntry() throws Exception {
        // Initialize the database
        timeEntry.setUser(userA);
        timeEntry.setProject(project);
        timeEntryRepository.saveAndFlush(timeEntry);
        timeEntry = timeEntrySearchRepository.save(timeEntry);

        // Get the timeEntry
        restTimeEntryMockMvc.perform(get("/api/time-entries/{id}", timeEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(timeEntry.getId().intValue()))
            .andExpect(jsonPath("$.start").value(sameInstant(DEFAULT_START)))
            .andExpect(jsonPath("$.end").value(sameInstant(DEFAULT_END)))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTimeEntry() throws Exception {
        // Get the timeEntry
        restTimeEntryMockMvc.perform(get("/api/time-entries/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void updateTimeEntry() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        timeEntry.setUser(userA);
        timeEntry.setProject(project);
        timeEntryRepository.saveAndFlush(timeEntry);
        timeEntrySearchRepository.save(timeEntry);
        int databaseSizeBeforeUpdate = timeEntryRepository.findAll().size();

        // Update the timeEntry
        TimeEntry updatedTimeEntry = timeEntryRepository.findOne(timeEntry.getId());
        // Disconnect from session so that the updates on updatedTimeEntry are not directly saved in db
        em.detach(updatedTimeEntry);
        updatedTimeEntry
            .start(UPDATED_START)
            .end(UPDATED_END)
            .comment(UPDATED_COMMENT);
        TimeEntryDTO timeEntryDTO = timeEntryMapper.toDto(updatedTimeEntry);

        restTimeEntryMockMvc.perform(put("/api/time-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(timeEntryDTO)))
            .andExpect(status().isOk());

        // Validate the TimeEntry in the database
        List<TimeEntry> timeEntryList = timeEntryRepository.findAll();
        assertThat(timeEntryList).hasSize(databaseSizeBeforeUpdate);
        TimeEntry testTimeEntry = timeEntryList.get(timeEntryList.size() - 1);
        assertThat(testTimeEntry.getStart()).isEqualTo(UPDATED_START);
        assertThat(testTimeEntry.getEnd()).isEqualTo(UPDATED_END);
        assertThat(testTimeEntry.getComment()).isEqualTo(UPDATED_COMMENT);

        // Validate the TimeEntry in Elasticsearch
        TimeEntry timeEntryEs = timeEntrySearchRepository.findOne(testTimeEntry.getId());
        assertThat(testTimeEntry.getStart()).isEqualTo(testTimeEntry.getStart());
        assertThat(testTimeEntry.getEnd()).isEqualTo(testTimeEntry.getEnd());
        assertThat(timeEntryEs).isEqualToIgnoringGivenFields(testTimeEntry, "start", "end");
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void updateNonExistingTimeEntry() throws Exception {

        // Initialize the database
        timeEntry.setUser(userA);
        timeEntry.setProject(project);
        timeEntryRepository.saveAndFlush(timeEntry);
        timeEntry = timeEntrySearchRepository.save(timeEntry);

        int databaseSizeBeforeUpdate = timeEntryRepository.findAll().size();

        // Create the TimeEntry
        TimeEntryDTO timeEntryDTO = timeEntryMapper.toDto(timeEntry);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTimeEntryMockMvc.perform(put("/api/time-entries")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(timeEntryDTO)))
            .andExpect(status().isOk());

        // Validate the TimeEntry in the database
        List<TimeEntry> timeEntryList = timeEntryRepository.findAll();
        assertThat(timeEntryList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void deleteTimeEntry() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        timeEntry.setUser(userA);
        timeEntry.setProject(project);
        timeEntryRepository.saveAndFlush(timeEntry);
        timeEntrySearchRepository.save(timeEntry);

        int databaseSizeBeforeDelete = timeEntryRepository.findAll().size();

        // Get the timeEntry
        restTimeEntryMockMvc.perform(delete("/api/time-entries/{id}", timeEntry.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean timeEntryExistsInEs = timeEntrySearchRepository.exists(timeEntry.getId());
        assertThat(timeEntryExistsInEs).isFalse();

        // Validate the database is empty
        List<TimeEntry> timeEntryList = timeEntryRepository.findAll();
        assertThat(timeEntryList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void searchTimeEntry() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        timeEntry.setUser(userA);
        timeEntry.setProject(project);
        timeEntryRepository.saveAndFlush(timeEntry);
        timeEntrySearchRepository.save(timeEntry);

        // Search the timeEntry
        restTimeEntryMockMvc.perform(get("/api/_search/time-entries?query=id:" + timeEntry.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(timeEntry.getId().intValue())))
            .andExpect(jsonPath("$.[*].start").value(hasItem(sameInstant(DEFAULT_START))))
            .andExpect(jsonPath("$.[*].end").value(hasItem(sameInstant(DEFAULT_END))))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TimeEntry.class);
        TimeEntry timeEntry1 = new TimeEntry();
        timeEntry1.setId(1L);
        TimeEntry timeEntry2 = new TimeEntry();
        timeEntry2.setId(timeEntry1.getId());
        assertThat(timeEntry1).isEqualTo(timeEntry2);
        timeEntry2.setId(2L);
        assertThat(timeEntry1).isNotEqualTo(timeEntry2);
        timeEntry1.setId(null);
        assertThat(timeEntry1).isNotEqualTo(timeEntry2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(TimeEntryDTO.class);
        TimeEntryDTO timeEntryDTO1 = new TimeEntryDTO();
        timeEntryDTO1.setId(1L);
        TimeEntryDTO timeEntryDTO2 = new TimeEntryDTO();
        assertThat(timeEntryDTO1).isNotEqualTo(timeEntryDTO2);
        timeEntryDTO2.setId(timeEntryDTO1.getId());
        assertThat(timeEntryDTO1).isEqualTo(timeEntryDTO2);
        timeEntryDTO2.setId(2L);
        assertThat(timeEntryDTO1).isNotEqualTo(timeEntryDTO2);
        timeEntryDTO1.setId(null);
        assertThat(timeEntryDTO1).isNotEqualTo(timeEntryDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(timeEntryMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(timeEntryMapper.fromId(null)).isNull();
    }
}
