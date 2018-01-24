package com.arnellconsulting.worktajm.service.mapper;

import com.arnellconsulting.worktajm.domain.*;
import com.arnellconsulting.worktajm.service.dto.DomainDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Domain and its DTO DomainDTO.
 */
@Mapper(componentModel = "spring", uses = {AddressMapper.class, UserMapper.class})
public interface DomainMapper extends EntityMapper<DomainDTO, Domain> {

    @Mapping(source = "address.id", target = "addressId")
    @Mapping(source = "address.addressLine1", target = "addressAddressLine1")
    DomainDTO toDto(Domain domain);

    @Mapping(source = "addressId", target = "address")
    @Mapping(target = "customers", ignore = true)
    Domain toEntity(DomainDTO domainDTO);

    default Domain fromId(Long id) {
        if (id == null) {
            return null;
        }
        Domain domain = new Domain();
        domain.setId(id);
        return domain;
    }
}
