DROP TABLE IF EXISTS products.category;
create TABLE products.category (
id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255)
);
USE PRODUCTS;
INSERT INTO products.category (name)
SELECT category
from bigbasket
GROUP BY category;
DROP TABLE IF EXISTS products.subcategory;
create TABLE products.subcategory (
id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255)
);
USE PRODUCTS;
INSERT INTO products.subcategory (name)
SELECT subcategory
from bigbasket
GROUP BY subcategory;
DROP TABLE IF EXISTS products.brand;
create TABLE products.brand (
id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255)
);
USE PRODUCTS;
INSERT INTO products.brand (name)
SELECT brand
from bigbasket
GROUP BY brand;
DROP TABLE IF EXISTS products.products;
create TABLE products.products (
id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
productName VARCHAR(255),
brandId int,
price double,
discountPrice double,
imageUrl TEXT,
quantity VARCHAR(100),
categoryId int,
subcategoryId int,
absoluteUrl TEXT,
FOREIGN KEY (brandId) REFERENCES brand(id),
FOREIGN KEY (categoryId) REFERENCES category(id),
FOREIGN KEY (subcategoryId) REFERENCES subcategory(id)
);
INSERT INTO products.products (productName,brandId,price,discountPrice,imageUrl,quantity,categoryId,SubCategoryId,absoluteUrl)
SELECT t1.ProductName, t2.id as brand, t1.Price, t1.DiscountPrice, t1.Image_Url, t1.Quantity, t3.id as Category, t4.id as subCategory, t1.Absolute_Url
from bigbasket t1 inner join
products.brand t2
on t1.brand = t2.name inner join
products.category t3
on t1.category = t3.name inner join
products.subcategory t4
on t1.subcategory = t4.name;