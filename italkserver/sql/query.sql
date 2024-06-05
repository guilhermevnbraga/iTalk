create database users;

use users;

create table user (
	id int auto_increment,
    friend_list_id int,
    name varchar(60) not null,
    email varchar(90) not null unique,
    password varchar(255) not null,
    profile_picture longblob,
    primary key(id)
);

create table friend_list (
	id int auto_increment primary key,
    user_id int not null,
    foreign key(user_id) references user(id)
);

ALTER TABLE user
ADD CONSTRAINT fk_friend_list FOREIGN KEY (friend_list_id) REFERENCES friend_list(id);

create table friend_list_has_user (
	user_id int not null,
    friend_list_id int not null,
    primary key (user_id, friend_list_id)
);

alter table friend_list_has_user
add constraint fk_user foreign key (user_id) references user(id);

alter table friend_list_has_user
add constraint fk_friend_list_user foreign key (friend_list_id) references friend_list(id);

create table chat_history (
	id int auto_increment primary key,
    user1_id int,
    user2_id int
);

alter table chat_history
add constraint fk_history_user1 foreign key (user1_id) references user(id);

alter table chat_history
add constraint fk_history_user2 foreign key (user2_id) references user(id);

create table post (
	id int auto_increment primary key,
    user_id int,
    post_id int,
    message text not null,
    attachments longblob
);

alter table post
add constraint fk_post_user foreign key (user_id) references user(id);

alter table post
add constraint fk_post_id foreign key (post_id) references post(id);

create table message (
	user_id int,
    chat_history_id int,
    content text,
    attachment longblob,
    reaction int unsigned,
    primary key(user_id, chat_history_id)
);

alter table message
add constraint fk_message_user foreign key (user_id) references user(id);

alter table message
add constraint fk_message_history foreign key (chat_history_id) references chat_history(id);
