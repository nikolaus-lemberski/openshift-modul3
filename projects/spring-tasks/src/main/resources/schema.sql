create table if not exists task (
  id integer auto_increment primary key,
  description varchar(255),
  done boolean
);