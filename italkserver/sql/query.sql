CREATE TABLE attachments (
  id varchar(36) NOT NULL,
  post_id varchar(36) DEFAULT NULL,
  title text,
  attachment longblob,
  PRIMARY KEY (id),
  KEY post_id (post_id),
  CONSTRAINT attachments_ibfk_1 FOREIGN KEY (post_id) REFERENCES post (id)
);

CREATE TABLE friend (
  user_id int,
  friend_id int,
  primary key (user_id, friend_id)
);

CREATE TABLE message (
  id int NOT NULL AUTO_INCREMENT,
  sender_id int NOT NULL,
  reciever_id int NOT NULL,
  content text,
  attachment longblob,
  reaction int unsigned DEFAULT NULL,
  date bigint not null,
  PRIMARY KEY (id),
  FOREIGN KEY (sender_id) REFERENCES user (id),
  FOREIGN KEY (reciever_id) REFERENCES user (id) ON DELETE CASCADE
);

select * from message;

CREATE TABLE post (
  id varchar(36) NOT NULL,
  user_id int DEFAULT NULL,
  post_id varchar(36) DEFAULT NULL,
  message text NOT NULL,
  locale text,
  mood text,
  date bigint DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_post_user (user_id),
  KEY fk_post_id (post_id),
  CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES post (id),
  CONSTRAINT fk_post_user FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE post_picture (
  id varchar(36) NOT NULL,
  post_id varchar(36) DEFAULT NULL,
  picture longblob,
  PRIMARY KEY (id),
  KEY post_id (post_id),
  CONSTRAINT post_picture_ibfk_1 FOREIGN KEY (post_id) REFERENCES post (id)
);

CREATE TABLE user (
  id int NOT NULL AUTO_INCREMENT,
  friend_list_id int DEFAULT NULL,
  name varchar(60) NOT NULL,
  username varchar(60) NOT NULL UNIQUE,
  email varchar(90) NOT NULL,
  password varchar(255) NOT NULL,
  profile_picture longblob,
  banner longblob,
  status tinyint(1),
  about text,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY fk_friend_list (friend_list_id),
  CONSTRAINT fk_friend_list FOREIGN KEY (friend_list_id) REFERENCES friend_list (id)
);

select * from user;
select * from friend;