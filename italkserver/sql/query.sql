CREATE TABLE attachments (
  id varchar(36) NOT NULL,
  post_id varchar(36) DEFAULT NULL,
  title text,
  attachment longblob,
  PRIMARY KEY (id),
  KEY post_id (post_id),
  CONSTRAINT attachments_ibfk_1 FOREIGN KEY (post_id) REFERENCES post (id)
);

CREATE TABLE chat_history (
  id int NOT NULL AUTO_INCREMENT,
  user1_id int DEFAULT NULL,
  user2_id int DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_history_user1 (user1_id),
  KEY fk_history_user2 (user2_id),
  CONSTRAINT fk_history_user1 FOREIGN KEY (user1_id) REFERENCES user (id),
  CONSTRAINT fk_history_user2 FOREIGN KEY (user2_id) REFERENCES user (id)
);

CREATE TABLE friend_list (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  PRIMARY KEY (id),
  KEY user_id (user_id),
  CONSTRAINT friend_list_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE friend_list_has_user (
  user_id int NOT NULL,
  friend_list_id int NOT NULL,
  PRIMARY KEY (user_id,friend_list_id),
  KEY fk_friend_list_user (friend_list_id),
  CONSTRAINT fk_friend_list_user FOREIGN KEY (friend_list_id) REFERENCES friend_list (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE message (
  user_id int NOT NULL,
  chat_history_id int NOT NULL,
  content text,
  attachment longblob,
  reaction int unsigned DEFAULT NULL,
  PRIMARY KEY (user_id,chat_history_id),
  KEY fk_message_history (chat_history_id),
  CONSTRAINT fk_message_history FOREIGN KEY (chat_history_id) REFERENCES chat_history (id),
  CONSTRAINT fk_message_user FOREIGN KEY (user_id) REFERENCES user (id)
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
  email varchar(90) NOT NULL,
  password varchar(255) NOT NULL,
  profile_picture longblob,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY fk_friend_list (friend_list_id),
  CONSTRAINT fk_friend_list FOREIGN KEY (friend_list_id) REFERENCES friend_list (id)
);
