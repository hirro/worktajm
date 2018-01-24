package com.arnellconsulting.worktajm.repository.search;

import com.arnellconsulting.worktajm.domain.UserExtra;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the UserExtra entity.
 */
public interface UserExtraSearchRepository extends ElasticsearchRepository<UserExtra, Long> {
}
