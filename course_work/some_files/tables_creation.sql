/*
drop table favorite;
drop table reply;
drop table reply_status;
drop table message;
drop table vacancy_skill;
drop table vacancy;
drop table skill;
drop table company_member;
drop table company;
drop table token;
drop table account;
drop table account_info;
*/

create table account(
    id serial primary key,
    login varchar(255) not null,
    password_hash text not null,
    password_salt text not null,
    is_admin boolean not null default false
);

create table account_info(
    id serial primary key references account(id),
    name varchar(255) not null,
    age integer,
    phone varchar(255),
    website varchar(255),
    about text
);


create table token(
    id serial primary key,
    account_id integer references account(id),
    token text not null,
    date timestamp not null
);

create table company(
    id serial primary key,
    owner_id integer references account(id),
    name varchar(255) not null,
    about text,
    website varchar(255),
    phone varchar(255)
);

create table company_member(
    account_id integer primary key references account(id),
    company_id integer references company(id),
    is_owner boolean not null default false
);

create table skill(
    id serial primary key,
    name varchar(255) not null
);

create table vacancy(
    id serial primary key,
    owner_id integer references account(id),
    company_id integer references company(id),
    title varchar(255) not null,
    about text,
    salary varchar(255),
    post_date timestamp not null default now(),
    is_active boolean not null default true
);

create table vacancy_skill(
    id serial primary key,
    vacancy_id integer references vacancy(id),
    skill_id integer references skill(id)
);

create table message(
    id serial primary key,
    from_id integer references account(id),
    to_id integer references account(id),
    text text not null,
    date timestamp not null default now()
);

create table reply_status(
    id serial primary key,
    name varchar(255) not null
);

create table reply(
    id serial primary key,
    vacancy_id integer references vacancy(id),
    account_id integer references account(id),
    date timestamp not null default now(),
    reply_status_id integer references reply_status(id)
);

create table favorite(
    id serial primary key,
    account_id integer references account(id),
    vacancy_id integer references vacancy(id),
    date timestamp not null default now()
);