# API

## Security model

* Domain has one or more authorized users of two types of roles, USER or ADMIN.
* Domains are created during registration process, user creating it will be ADMIN.

* ADMIN may (for the domain(s) it belongs to):
    * C: During domain registration
    * RU: Update or read:
        * Projects.
        * Addresses
        * Customers
    * R:
        * Time entries
        
* USER may (for the domain(s) it belongs to):
    * R:
        * Projects
        * Address
        * Customers
        * Domain
    * CRUD:
        * Time Entries: 
            * C: Can create time entries in all projects user currently is a member of.
            * R: All time entries it owns.
            * UD: All time entries it owns that are not closed.
            
     
 
