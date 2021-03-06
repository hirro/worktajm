package com.arnellconsulting.worktajm.web.rest;

import com.arnellconsulting.worktajm.WorktajmApp;

import com.arnellconsulting.worktajm.domain.Domain;
import com.arnellconsulting.worktajm.domain.Address;
import com.arnellconsulting.worktajm.domain.User;
import com.arnellconsulting.worktajm.repository.DomainRepository;
import com.arnellconsulting.worktajm.repository.UserRepository;
import com.arnellconsulting.worktajm.repository.search.DomainSearchRepository;
import com.arnellconsulting.worktajm.service.UserService;
import com.arnellconsulting.worktajm.service.dto.DomainDTO;
import com.arnellconsulting.worktajm.service.mapper.DomainMapper;
import com.arnellconsulting.worktajm.web.rest.errors.ExceptionTranslator;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mapstruct.Context;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.aop.framework.Advised;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static com.arnellconsulting.worktajm.web.rest.TestUtil.createFormattingConversionService;
import static com.arnellconsulting.worktajm.web.rest.UserResourceIntTest.USER_A_LOGIN;
import static com.arnellconsulting.worktajm.web.rest.UserResourceIntTest.USER_B_LOGIN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the DomainResource REST controller.
 *
 * @see DomainResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = WorktajmApp.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class DomainResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private DomainMapper domainMapper;

    @Autowired
    private DomainSearchRepository domainSearchRepository;

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

    private MockMvc restDomainMockMvc;

    private Domain domain;

    private User userA;
    private User userB;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DomainResource domainResource = new DomainResource(
            domainRepository, domainMapper, domainSearchRepository, userService);
        this.restDomainMockMvc = MockMvcBuilders.standaloneSetup(domainResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @After
    public void cleanup() {
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Domain createEntity(EntityManager em) {
        Domain domain = new Domain().name(DEFAULT_NAME);
        // Add required entity
        Address address = TestUtil.createAddressEntity();
        domain.setAddress(address);
        return domain;
    }

    @Before
    public void initTest() {
        domain = createEntity(em);

        // Create test users
        userA = userRepository.findOne(5L);
        userB = userRepository.findOne(6L);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void createDomain() throws Exception {
        int databaseSizeBeforeCreate = domainRepository.findAll().size();

        // Create the Domain
        DomainDTO domainDTO = domainMapper.toDto(domain);
        restDomainMockMvc.perform(post("/api/domains")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainDTO)))
            .andExpect(status().isCreated());

        // Validate the Domain in the database
        List<Domain> domainList = domainRepository.findAll();
        assertThat(domainList).hasSize(databaseSizeBeforeCreate + 1);
        Domain testDomain = domainList.get(domainList.size() - 1);
        assertThat(testDomain.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the Domain in Elasticsearch
        Domain domainEs = domainSearchRepository.findOne(testDomain.getId());
        assertThat(domainEs).isEqualToIgnoringGivenFields(testDomain, "address");
        assertThat(domainEs.getAddress()).isEqualToIgnoringGivenFields(testDomain.getAddress());
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void createDomainWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = domainRepository.findAll().size();

        // Create the Domain with an existing ID
        domain.setId(1L);
        DomainDTO domainDTO = domainMapper.toDto(domain);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDomainMockMvc.perform(post("/api/domains")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Domain in the database
        List<Domain> domainList = domainRepository.findAll();
        assertThat(domainList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = domainRepository.findAll().size();

        // set the field null
        domain.setName(null);

        // Create the Domain, which fails.
        DomainDTO domainDTO = domainMapper.toDto(domain);

        restDomainMockMvc.perform(post("/api/domains")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainDTO)))
            .andExpect(status().isBadRequest());

        List<Domain> domainList = domainRepository.findAll();
        assertThat(domainList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void getAllDomains() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        domain.addAuthorizedUsers(this.userA);
        domainRepository.saveAndFlush(domain);

        // Get all the domainList
        restDomainMockMvc.perform(get("/api/domains?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(domain.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void getDomainAuthorized() throws Exception {
        // Get the domain
        restDomainMockMvc.perform(get("/api/domains/{id}", 1))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Domain A"));
    }

    @Test
    @Transactional
    @WithMockUser(USER_B_LOGIN)
    public void getDomainUnauthorized() throws Exception {
        // Initialize the database
        domainRepository.saveAndFlush(domain);

        // Get the domain
        restDomainMockMvc.perform(get("/api/domains/{id}", domain.getId()))
            .andExpect(status().isForbidden());
    }

    @Test
    @Transactional
    @WithMockUser(USER_B_LOGIN)
    public void getNonExistingDomain() throws Exception {
        // Get the domain
        restDomainMockMvc.perform(get("/api/domains/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void updateDomain() throws Exception {

        // Initialize the database
        domain.getAuthorizedUsers().add(userA);
        domainRepository.saveAndFlush(domain);
        domainSearchRepository.save(domain);
        int databaseSizeBeforeUpdate = domainRepository.findAll().size();

        // Update the domain
        Domain updatedDomain = domainRepository.findOne(domain.getId());
        // Disconnect from session so that the updates on updatedDomain are not directly saved in db
        em.detach(updatedDomain);
        updatedDomain.name(UPDATED_NAME);
        DomainDTO domainDTO = domainMapper.toDto(updatedDomain);

        restDomainMockMvc.perform(put("/api/domains")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainDTO)))
            .andExpect(status().isOk());

        // Validate the Domain in the database
        List<Domain> domainList = domainRepository.findAll();
        assertThat(domainList).hasSize(databaseSizeBeforeUpdate);
        Domain testDomain = domainList.get(domainList.size() - 1);
        assertThat(testDomain.getName()).isEqualTo(UPDATED_NAME);

        // Validate the Domain in Elasticsearch
        Domain domainEs = domainSearchRepository.findOne(testDomain.getId());
        assertThat(domainEs).isEqualToIgnoringGivenFields(testDomain, "address");
        assertThat(domainEs.getAddress()).isEqualToIgnoringGivenFields(testDomain.getAddress());
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void updateNonExistingDomain() throws Exception {
        int databaseSizeBeforeUpdate = domainRepository.findAll().size();

        // Create the Domain
        domain.setId(Long.MAX_VALUE);
        DomainDTO domainDTO = domainMapper.toDto(domain);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDomainMockMvc.perform(put("/api/domains")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(domainDTO)))
            .andExpect(status().isNotFound());

        // Validate the Domain in the database
        List<Domain> domainList = domainRepository.findAll();
        assertThat(domainList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void deleteDomain() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        domain.addAuthorizedUsers(this.userA);
        domainRepository.saveAndFlush(domain);
        domainSearchRepository.save(domain);
        int databaseSizeBeforeDelete = domainRepository.findAll().size();

        // Get the domain
        restDomainMockMvc.perform(delete("/api/domains/{id}", domain.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean domainExistsInEs = domainSearchRepository.exists(domain.getId());
        assertThat(domainExistsInEs).isFalse();

        // Validate the database is empty
        List<Domain> domainList = domainRepository.findAll();
        assertThat(domainList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchDomain() throws Exception {
        // Initialize the database
        domainRepository.saveAndFlush(domain);
        domainSearchRepository.save(domain);

        // Search the domain
        restDomainMockMvc.perform(get("/api/_search/domains?query=id:" + domain.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(domain.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Domain.class);
        Domain domain1 = new Domain();
        domain1.setId(1L);
        Domain domain2 = new Domain();
        domain2.setId(domain1.getId());
        assertThat(domain1).isEqualTo(domain2);
        domain2.setId(2L);
        assertThat(domain1).isNotEqualTo(domain2);
        domain1.setId(null);
        assertThat(domain1).isNotEqualTo(domain2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DomainDTO.class);
        DomainDTO domainDTO1 = new DomainDTO();
        domainDTO1.setId(1L);
        DomainDTO domainDTO2 = new DomainDTO();
        assertThat(domainDTO1).isNotEqualTo(domainDTO2);
        domainDTO2.setId(domainDTO1.getId());
        assertThat(domainDTO1).isEqualTo(domainDTO2);
        domainDTO2.setId(2L);
        assertThat(domainDTO1).isNotEqualTo(domainDTO2);
        domainDTO1.setId(null);
        assertThat(domainDTO1).isNotEqualTo(domainDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(domainMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(domainMapper.fromId(null)).isNull();
    }

    public void resetAll(ApplicationContext applicationContext) throws Exception {
        for (String name : applicationContext.getBeanDefinitionNames()) {
            Object bean = applicationContext.getBean(name);
            if (AopUtils.isAopProxy(bean) && bean instanceof Advised) {
                bean = ((Advised) bean).getTargetSource().getTarget();
            }
            if (Mockito.mockingDetails(bean).isMock()) {
                Mockito.reset(bean);
            }

        }
    }
}
