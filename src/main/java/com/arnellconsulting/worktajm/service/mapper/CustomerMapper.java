package com.arnellconsulting.worktajm.service.mapper;

import com.arnellconsulting.worktajm.domain.*;
import com.arnellconsulting.worktajm.service.dto.CustomerDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Customer and its DTO CustomerDTO.
 */
@Mapper(componentModel = "spring", uses = {AddressMapper.class, DomainMapper.class})
public interface CustomerMapper extends EntityMapper<CustomerDTO, Customer> {

    @Mapping(source = "address.id", target = "addressId")
    @Mapping(source = "address.addressLine1", target = "addressAddressLine1")
    @Mapping(source = "domain.id", target = "domainId")
    @Mapping(source = "domain.name", target = "domainName")
    CustomerDTO toDto(Customer customer); 

    @Mapping(source = "addressId", target = "address")
    @Mapping(target = "projects", ignore = true)
    @Mapping(source = "domainId", target = "domain")
    Customer toEntity(CustomerDTO customerDTO);

    default Customer fromId(Long id) {
        if (id == null) {
            return null;
        }
        Customer customer = new Customer();
        customer.setId(id);
        return customer;
    }
}
