package com.arnellconsulting.worktajm.repository.search;

import com.arnellconsulting.worktajm.domain.Domain;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Domain entity.
 */
public interface DomainSearchRepository extends ElasticsearchRepository<Domain, Long> {
}
