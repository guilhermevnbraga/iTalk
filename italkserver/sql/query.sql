CREATE TABLE user (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(60) NOT NULL,
  username varchar(60) NOT NULL UNIQUE,
  email varchar(90) NOT NULL,
  password varchar(255) NOT NULL,
  profilePicture longblob,
  banner longblob,
  status tinyint(1),
  about text,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
);

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
  senderId int NOT NULL,
  receiverId int NOT NULL,
  content text,
  attachment longblob,
  reaction int unsigned DEFAULT NULL,
  date bigint not null,
  PRIMARY KEY (id),
  FOREIGN KEY (senderId) REFERENCES user (id),
  FOREIGN KEY (receiverId) REFERENCES user (id) ON DELETE CASCADE
);

CREATE TABLE post_picture (
  id varchar(36) NOT NULL,
  post_id varchar(36) DEFAULT NULL,
  picture longblob,
  PRIMARY KEY (id),
  KEY post_id (post_id),
  CONSTRAINT post_picture_ibfk_1 FOREIGN KEY (post_id) REFERENCES post (id)
);
