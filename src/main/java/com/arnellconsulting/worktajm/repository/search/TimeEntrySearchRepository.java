package com.arnellconsulting.worktajm.repository.search;

import com.arnellconsulting.worktajm.domain.TimeEntry;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the TimeEntry entity.
 */
public interface TimeEntrySearchRepository extends ElasticsearchRepository<TimeEntry, Long> {
}
