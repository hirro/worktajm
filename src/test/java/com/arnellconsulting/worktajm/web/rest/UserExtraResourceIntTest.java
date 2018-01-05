package com.arnellconsulting.worktajm.web.rest;

import com.arnellconsulting.worktajm.WorktajmApp;

import com.arnellconsulting.worktajm.domain.User;
import com.arnellconsulting.worktajm.domain.UserExtra;
import com.arnellconsulting.worktajm.repository.UserExtraRepository;
import com.arnellconsulting.worktajm.repository.UserRepository;
import com.arnellconsulting.worktajm.repository.search.UserExtraSearchRepository;
import com.arnellconsulting.worktajm.service.dto.UserExtraDTO;
import com.arnellconsulting.worktajm.service.mapper.UserExtraMapper;
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
import java.util.List;

import static com.arnellconsulting.worktajm.web.rest.TestUtil.createFormattingConversionService;
import static com.arnellconsulting.worktajm.web.rest.UserResourceIntTest.USER_A_LOGIN;
import static com.arnellconsulting.worktajm.web.rest.UserResourceIntTest.USER_B_LOGIN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the UserExtraResource REST controller.
 *
 * @see UserExtraResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = WorktajmApp.class)
public class UserExtraResourceIntTest {

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    @Autowired
    private UserExtraRepository userExtraRepository;

    @Autowired
    private UserExtraMapper userExtraMapper;

    @Autowired
    private UserExtraSearchRepository userExtraSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUserExtraMockMvc;

    private UserExtra userExtra;

    @Autowired
    private UserRepository userRepository;

    private User userA;
    private User userB;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UserExtraResource userExtraResource = new UserExtraResource(userRepository, userExtraRepository, userExtraMapper, userExtraSearchRepository);
        this.restUserExtraMockMvc = MockMvcBuilders.standaloneSetup(userExtraResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserExtra createEntity(EntityManager em) {
        UserExtra userExtra = new UserExtra()
            .phone(DEFAULT_PHONE);
        return userExtra;
    }

    @Before
    public void initTest() {
        userExtraSearchRepository.deleteAll();
        userRepository.deleteAll();

        // Create test users
        userExtra = createEntity(em);
        userA = UserResourceIntTest.createEntity(em);
        userA.setLogin(USER_A_LOGIN);
        userB = UserResourceIntTest.createEntity(em);
        userB.setLogin(USER_B_LOGIN);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void getUserExtraExisting() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        userExtra.setUser(userA);
        userExtraRepository.saveAndFlush(userExtra);

        // Get the userExtra
        restUserExtraMockMvc.perform(get("/api/user-extras", userExtra.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(userExtra.getId().intValue()))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE.toString()));
    }

    @Test
    @Transactional
    @WithMockUser(USER_B_LOGIN)
    public void getUserExtraNotExisting() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        userRepository.saveAndFlush(userB);
        userExtra.setUser(userA);
        userExtraRepository.saveAndFlush(userExtra);

        // Get the userExtra
        restUserExtraMockMvc.perform(get("/api/user-extras", userExtra.getId()))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(USER_B_LOGIN)
    public void getUserExtraUnknownUser() throws Exception {
        // Get the userExtra
        restUserExtraMockMvc.perform(get("/api/user-extras", userExtra.getId()))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void updateUserExtra() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);
        userExtra.setUser(userA);
        userExtraRepository.saveAndFlush(userExtra);

        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();

        // Update the userExtra
        UserExtra updatedUserExtra = userExtraRepository.findOne(userExtra.getId());
        // Disconnect from session so that the updates on updatedUserExtra are not directly saved in db
        em.detach(updatedUserExtra);
        updatedUserExtra
            .phone(UPDATED_PHONE);
        UserExtraDTO userExtraDTO = userExtraMapper.toDto(updatedUserExtra);

        restUserExtraMockMvc.perform(put("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtraDTO)))
            .andExpect(status().isOk());

        // Validate the UserExtra in the database
        List<UserExtra> userExtraList = userExtraRepository.findAll();
        assertThat(userExtraList).hasSize(databaseSizeBeforeUpdate);
        UserExtra testUserExtra = userExtraList.get(userExtraList.size() - 1);
        assertThat(testUserExtra.getPhone()).isEqualTo(UPDATED_PHONE);

        // Validate the UserExtra in Elasticsearch
        UserExtra userExtraEs = userExtraSearchRepository.findOne(testUserExtra.getId());
        assertThat(userExtraEs).isEqualToIgnoringGivenFields(testUserExtra);
    }

    @Test
    @Transactional
    @WithMockUser(USER_A_LOGIN)
    public void updateNonExistingUserExtra() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(userA);

        int databaseSizeBeforeUpdate = userExtraRepository.findAll().size();

        // Create the UserExtra
        UserExtraDTO userExtraDTO = userExtraMapper.toDto(userExtra);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restUserExtraMockMvc.perform(put("/api/user-extras")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userExtraDTO)))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserExtra.class);
        UserExtra userExtra1 = new UserExtra();
        userExtra1.setId(1L);
        UserExtra userExtra2 = new UserExtra();
        userExtra2.setId(userExtra1.getId());
        assertThat(userExtra1).isEqualTo(userExtra2);
        userExtra2.setId(2L);
        assertThat(userExtra1).isNotEqualTo(userExtra2);
        userExtra1.setId(null);
        assertThat(userExtra1).isNotEqualTo(userExtra2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserExtraDTO.class);
        UserExtraDTO userExtraDTO1 = new UserExtraDTO();
        userExtraDTO1.setId(1L);
        UserExtraDTO userExtraDTO2 = new UserExtraDTO();
        assertThat(userExtraDTO1).isNotEqualTo(userExtraDTO2);
        userExtraDTO2.setId(userExtraDTO1.getId());
        assertThat(userExtraDTO1).isEqualTo(userExtraDTO2);
        userExtraDTO2.setId(2L);
        assertThat(userExtraDTO1).isNotEqualTo(userExtraDTO2);
        userExtraDTO1.setId(null);
        assertThat(userExtraDTO1).isNotEqualTo(userExtraDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(userExtraMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(userExtraMapper.fromId(null)).isNull();
    }
}
