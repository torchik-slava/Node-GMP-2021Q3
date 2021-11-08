DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
	id uuid DEFAULT uuid_generate_v4 (),
	login VARCHAR NOT NULL,
	password VARCHAR NOT NULL,
	age INTEGER NOT NULL,
	is_deleted BOOLEAN,
	PRIMARY KEY (id)
);

INSERT INTO Users
VALUES
('d3df0357-c383-46c6-9f90-a206a37cef89', 'One', 'password1', 21, false),
('a6386145-8fdb-4b3e-838a-2d36d828b822', 'Two', 'password2', 22, false),
('87605f35-9901-42e1-9014-2a56dbc38ad4', 'Three', 'password3', 23, false),
('338883ee-19d6-40b4-9766-32b4f726d2aa', 'Four', 'password4', 24, false),
('a2cee924-08b3-44e0-b668-ecc7b1f84be2', 'Five', 'password5', 25, false),
('bbc5986a-e276-46d4-85e3-07478fdea0b0', 'Six', 'password6', 26, false),
('b00cd1ee-fc67-4795-aff9-ba5d62599bec', 'Seven', 'password7', 27, false),
('4fd5ed26-f9d7-4ec6-aad8-d547385d7e13', 'Eight', 'password8', 28, false),
('70452069-126e-4abb-bf7f-32bb4b62ea6f', 'Nine', 'password9', 29, false),
('0ee75a1c-8fee-4e52-a44c-a234a3ffa93d', 'Ten', 'password10', 30, false);
