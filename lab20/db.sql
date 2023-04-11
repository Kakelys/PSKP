
create table country (
    id serial primary key,
    name text not null
);

create table office (
    id serial primary key,
    address text not null,
    phone text not null,
    email text not null,
    country_id int references country(id)
);

create table customer (
    id serial primary key,
    name text not null,
    phone text not null
);

create table employer (
    id serial primary key,
    name text not null,
    phone text not null,
    email text not null,
    office_id int references office(id) not null
);

create table route (
    id serial primary key,
    from_country_id int references country(id),
    to_country_id int references country(id),
    price money not null
);

create table request (
    id serial primary key,
    customer_id int references customer(id),
    employer_id int references employer(id),
    route_id int references route(id),
    req_date date not null
);








