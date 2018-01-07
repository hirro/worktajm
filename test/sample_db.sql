INSERT INTO `jhi_user` (`id`, `login`, `password_hash`, `first_name`, `last_name`, `email`, `image_url`, `activated`, `lang_key`, `activation_key`, `reset_key`, `created_by`, `created_date`, `reset_date`, `last_modified_by`, `last_modified_date`)
VALUES
    (5,'jim','$2a$10$nJ3De2xkUTgG2s4k1XiOH.zYchtqBhB6A3EuE5GYdrGaAlCRzVRii','jim','a','jim@example.com',NULL,b'1','en',NULL,NULL,'anonymousUser','2018-01-04 12:55:33',NULL,'anonymousUser','2018-01-04 12:55:33'),
    (6,'frank','$2a$10$jzrzjCGcj47dG5szDLprve6KuIVOa29vCASeqVw2BnMr3hpkBPZwW','frank','b','frank@example.com',NULL,b'1','en',NULL,NULL,'anonymousUser','2018-01-04 12:56:16',NULL,'anonymousUser','2018-01-04 12:56:16');

INSERT INTO `user_extra` (`user_id`)
VALUES
    (5),
    (6);

INSERT INTO `jhi_user_authority` (`user_id`, `authority_name`)
VALUES
    (5,'ROLE_USER'),
    (6,'ROLE_USER');

INSERT INTO `address` (`id`, `organization_number`, `address_line_1`, `address_line_2`, `address_line_3`, `city`, `zip_or_postcode`, `state_province_county`, `country`, `address_details`)
VALUES
    (1,NULL,'A street',NULL,NULL,'','',NULL,'','Domain A'),
    (2,NULL,'B street',NULL,NULL,'','',NULL,'','Domain B'),
    (3,NULL,'C street',NULL,NULL,'','',NULL,'','Domain A'),
    (4,NULL,'C street',NULL,NULL,'','',NULL,'','Domain B'),
    (5,NULL,'D street',NULL,NULL,'','',NULL,'','Domain A'),
    (6,NULL,'E street',NULL,NULL,'','',NULL,'','Domain B');

INSERT INTO `domain` (`id`, `name`, `address_id`)
VALUES
    (1,'Domain A',1),
    (2,'Domain B',2);

INSERT INTO `customer` (`id`, `name`, `address_id`, `domain_id`)
VALUES
    (1,'Customer C',3,1),
    (2,'Customer C',4,2),
    (3,'Customer D',5,1),
    (4,'Customer E',6,2);

INSERT INTO `project` (`id`, `name`, `description`, `hourly_rate`, `customer_id`)
VALUES
    (1,'General Development','For customer C (via domain A)',333,1),
    (2,'General Development','For customer C (via domain B)',333,2),
    (3,'General Development','For customer D (via domain A)',444,3),
    (4,'General Development','For customer E (via domain B)',444,4),
    (5,'Meetings'           ,'For customer C (via domain A)',444,1);

INSERT INTO `project_project_members` (`project_members_id`, `projects_id`)
VALUES
    (5,1),
    (6,2),
    (5,3),
    (6,4),
    (5,5);
;

