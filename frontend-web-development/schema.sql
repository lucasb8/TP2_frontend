-- ---------------------- User ----------------------

CREATE TABLE `UserRevision` (
`revisionId` int(11) NOT NULL,
`id` int(11) NOT NULL, 
`editCommitId` int(11) NOT NULL, 
`editDate` datetime NOT NULL DEFAULT current_timestamp(), 
`firstname` varchar(64) NOT NULL, 
`lastname` varchar(64) NOT NULL, 
`email` varchar(255)  NULL, 
`passwordHash` varchar(128)  NULL, 
`role` enum('customer','employee','operator') NOT NULL, 
`deleteCommitId` int(11) DEFAULT NULL, 
`deleteDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `UserRevision` ADD PRIMARY KEY (`revisionId`);

ALTER TABLE `UserRevision` CHANGE `revisionId` `revisionId` INT(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `User` (
`id` int(11) NOT NULL, 
`editCommitId` int(11) NOT NULL, 
`editDate` datetime NOT NULL DEFAULT current_timestamp(), 
`firstname` varchar(64) NOT NULL, 
`lastname` varchar(64) NOT NULL, 
`email` varchar(255)  NULL, 
`passwordHash` varchar(128)  NULL, 
`role` enum('customer','employee','operator') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `User` ADD PRIMARY KEY (`id`);

ALTER TABLE `User` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `User` ADD UNIQUE(`email`);
-- ---------------------- Commit ----------------------

CREATE TABLE `Commit` (
`id` int(11) NOT NULL,
`author` varchar(64) NOT NULL,
`message` text DEFAULT NULL,
`openedAt` datetime NOT NULL DEFAULT current_timestamp(),
`closedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `Commit` ADD PRIMARY KEY (`id`);

ALTER TABLE `Commit` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;
