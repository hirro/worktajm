package com.arnellconsulting.worktajm.service;

import com.codahale.metrics.annotation.Timed;
import com.arnellconsulting.worktajm.domain.*;
import com.arnellconsulting.worktajm.repository.*;
import com.arnellconsulting.worktajm.repository.search.*;
import org.elasticsearch.indices.IndexAlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.util.List;

@Service
public class ElasticsearchIndexService {

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final AddressRepository addressRepository;

    private final AddressSearchRepository addressSearchRepository;

    private final CustomerRepository customerRepository;

    private final CustomerSearchRepository customerSearchRepository;

    private final DomainRepository domainRepository;

    private final DomainSearchRepository domainSearchRepository;

    private final ProjectRepository projectRepository;

    private final ProjectSearchRepository projectSearchRepository;

    private final TimeEntryRepository timeEntryRepository;

    private final TimeEntrySearchRepository timeEntrySearchRepository;

    private final UserExtraRepository userExtraRepository;

    private final UserExtraSearchRepository userExtraSearchRepository;

    private final UserRepository userRepository;

    private final UserSearchRepository userSearchRepository;

    private final ElasticsearchTemplate elasticsearchTemplate;

    public ElasticsearchIndexService(
        UserRepository userRepository,
        UserSearchRepository userSearchRepository,
        AddressRepository addressRepository,
        AddressSearchRepository addressSearchRepository,
        CustomerRepository customerRepository,
        CustomerSearchRepository customerSearchRepository,
        DomainRepository domainRepository,
        DomainSearchRepository domainSearchRepository,
        ProjectRepository projectRepository,
        ProjectSearchRepository projectSearchRepository,
        TimeEntryRepository timeEntryRepository,
        TimeEntrySearchRepository timeEntrySearchRepository,
        UserExtraRepository userExtraRepository,
        UserExtraSearchRepository userExtraSearchRepository,
        ElasticsearchTemplate elasticsearchTemplate) {
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.addressRepository = addressRepository;
        this.addressSearchRepository = addressSearchRepository;
        this.customerRepository = customerRepository;
        this.customerSearchRepository = customerSearchRepository;
        this.domainRepository = domainRepository;
        this.domainSearchRepository = domainSearchRepository;
        this.projectRepository = projectRepository;
        this.projectSearchRepository = projectSearchRepository;
        this.timeEntryRepository = timeEntryRepository;
        this.timeEntrySearchRepository = timeEntrySearchRepository;
        this.userExtraRepository = userExtraRepository;
        this.userExtraSearchRepository = userExtraSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
    }

    @Async
    @Timed
    public void reindexAll() {
        reindexForClass(Address.class, addressRepository, addressSearchRepository);
        reindexForClass(Customer.class, customerRepository, customerSearchRepository);
        reindexForClass(Domain.class, domainRepository, domainSearchRepository);
        reindexForClass(Project.class, projectRepository, projectSearchRepository);
        reindexForClass(TimeEntry.class, timeEntryRepository, timeEntrySearchRepository);
        reindexForClass(UserExtra.class, userExtraRepository, userExtraSearchRepository);
        reindexForClass(User.class, userRepository, userSearchRepository);

        log.info("Elasticsearch: Successfully performed reindexing");
    }

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    private <T, ID extends Serializable> void reindexForClass(Class<T> entityClass, JpaRepository<T, ID> jpaRepository,
                                                              ElasticsearchRepository<T, ID> elasticsearchRepository) {
        elasticsearchTemplate.deleteIndex(entityClass);
        try {
            elasticsearchTemplate.createIndex(entityClass);
        } catch (IndexAlreadyExistsException e) {
            // Do nothing. Index was already concurrently recreated by some other service.
        }
        elasticsearchTemplate.putMapping(entityClass);
        if (jpaRepository.count() > 0) {
            try {
                Method m = jpaRepository.getClass().getMethod("findAllWithEagerRelationships");
                elasticsearchRepository.save((List<T>) m.invoke(jpaRepository));
            } catch (Exception e) {
                elasticsearchRepository.save(jpaRepository.findAll());
            }
        }
        log.info("Elasticsearch: Indexed all rows for " + entityClass.getSimpleName());
    }
}
