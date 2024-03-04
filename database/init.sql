--Every command here will be executed when the container is created
CREATE TABLE CATEGORIES (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(255),
    TAX NUMERIC(10,2) NOT NULL,
    ACTIVE INTEGER DEFAULT 1
);

CREATE TABLE PRODUCTS (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(255),
    PRICE NUMERIC(10,2) NOT NULL,
    CATEGORY_ID INTEGER,
    AMOUNT INTEGER NOT NULL,
    CONSTRAINT FK_CATEGORY FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORIES(ID),
    ACTIVE INTEGER DEFAULT 1
);

CREATE TABLE USERS(
    ID SERIAL PRIMARY KEY,
    USERNAME VARCHAR(255) UNIQUE NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL
);

CREATE TABLE USER_TOKEN(
    ID SERIAL PRIMARY KEY,
    TOKEN VARCHAR(255) UNIQUE,
    USER_ID INTEGER,
    CONSTRAINT FK_USER FOREIGN KEY (USER_ID) REFERENCES USERS(ID)   
);


CREATE TABLE ORDERS (
    ID SERIAL PRIMARY KEY,
    TOTAL NUMERIC(10,2),
    TAX NUMERIC(10,2),
    ACTIVE INTEGER DEFAULT 1,
    USER_ID INTEGER,
    CONSTRAINT FK_USER FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);

CREATE TABLE ORDER_ITEM(
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(255),
    ORDER_ID INTEGER,
    PRODUCT_ID INTEGER,
    AMOUNT INTEGER NOT NULL,
    PRICE NUMERIC(10,2),
    TAX NUMERIC(10,2),
    CONSTRAINT FK_PRODUCT FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(ID),
    CONSTRAINT FK_ORDER FOREIGN KEY (ORDER_ID) REFERENCES ORDERS(ID),
    ACTIVE INTEGER DEFAULT 1
)