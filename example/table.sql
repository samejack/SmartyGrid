DROP TABLE IF EXISTS `example_table`;

CREATE TABLE `example_table` (
    `id`          int(10) unsigned NOT NULL AUTO_INCREMENT,
    `username`    varchar(32)      ,
	`realname`    varchar(32)      ,
    `title`       varchar(128)     ,
	`email`       varchar(128)     ,
    `create_time` datetime         ,
    PRIMARY KEY (`id`)
);

INSERT INTO example_table(realname, username, title, email, create_time) VALUES
    ('SJ Chou', 'sj', 'Developer', 'sj@gmail.com', NOW()),
	('David Lu', 'david', 'Developer', 'david@yahoo.com', NOW()),
	('Fins Dodo', 'fins', 'Developer', 'fins@msn.com', NOW()),
	('Steve Jobs', 'steve', 'CEO.', 'jobs@heaven.com', NOW()),
	('Hot Dog', 'dog', '-', 'dogman@gmail.com', NOW()),
	('Abel', 'abel', 'Staff', 'abel@yahoo.com', NOW()),
	('Bill Lee', 'bill', 'Staff', 'bill@msn.com', NOW()),
	('Bob', 'bob', 'Staff', 'bob@heaven.com', NOW()),
	('Garfield', 'garfield', 'Coder', 'garfield@heaven.com', NOW()),
	('Ashley', 'player', 'Staff', 'ashley@heaven.com', NOW()),
	('Carry Lin', 'carry_lin', 'Coder', 'carry@heaven.com', NOW()),
	('Charlotte', 'charlotte', 'Staff', 'charlotte@heaven.com', NOW()),
	('Louisa', 'louisa', 'Staff', 'louisa@heaven.com', NOW()),
	('Joy', 'joy', 'Designer', 'joy@heaven.com', NOW()),
	('June', 'june', 'Art', 'june@heaven.com', NOW()),
	('Peggy', 'peggy', 'Tester', 'peggy@heaven.com', NOW());