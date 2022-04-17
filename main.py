from flask import Flask, request, jsonify
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy, functools
import json
import os

# ==============================================
#  Setup
# ==============================================

db_file = os.path.join(os.path.dirname(__file__), "db/book_db.db")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_file}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# ==============================================
#  Models
# ==============================================
class Customers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)

    def __init__(self, first_name, last_name, phone):
        self.first_name = first_name
        self.last_name = last_name
        self.phone = phone

    def __repr__(self):
        return "<Customers id={}>" % self.id

    def __str__(self):
        return str(self.id)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
        }


class Authors(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Authors id={}>' % self.id

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Publishers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Publishers id={}>' % self.id

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }


class Books(db.Model):
    isbn = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    a_id = db.Column("author_id", db.Integer, nullable=False)
    p_id = db.Column("publisher_id", db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)

    def __init__(self, isbn, name, price, a_id, p_id):
        self.isbn = isbn
        self.name = name
        self.price = price
        self.a_id = a_id
        self.p_id = p_id

    def __repr__(self):
        return '<Books id={}>' % self.isbn

    def to_dict(self):
        return {
            "isbn": self.isbn,
            "name": self.name,
            "price": self.price,
            "a_id": self.a_id,
            "author": Authors.query.get(self.a_id).name,
            "p_id": self.p_id,
            "publisher": Publishers.query.get(self.p_id).name,
        }


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    c_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    total = db.Column(db.Float, nullable=False)

    def __init__(self, c_id, total):
        self.c_id = c_id
        self.total = total

    def __repr__(self):
        return "<Orders id={}>" % self.id

    def __str__(self):
        return str(self.id)

    def to_dict(self):
        return {
            "id": self.id,
            "c_id": self.c_id,
            "total": self.total,
        }


class OrderItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    o_id = db.Column("o_id", db.Integer, db.ForeignKey(
        'orders.id'), nullable=False)
    c_id = db.Column("c_id", db.Integer, db.ForeignKey(
        'customers.id'), nullable=False)
    isbn = db.Column(db.Integer, db.ForeignKey('books.isbn'), nullable=False)
    purchased_on = db.Column(db.DateTime)

    def __init__(self, o_id, c_id, isbn):
        self.o_id = o_id
        self.c_id = c_id
        self.isbn = isbn
        self.purchased_on = datetime.now()

    def __repr__(self):
        return "<OrderItems o_id={} c_id={}>" % self.o_id, self.c_id

    def __str__(self):
        return f"{str(self.o_id)} {str(self.c_id)}"

    def to_dict(self):
        return {
            "id": self.id,
            "c_id": self.c_id,
            "total": self.total,
        }


db.create_all()

# ==============================================
#  Routes
# ==============================================


@app.route('/')
def index():
    return 'Hello World!'


@app.route('/customers/')
def get_customers():
    customers = Customers.query.all()

    for i in range(len(customers)):
        customers[i] = customers[i].to_dict()

    return jsonify(customers)


@app.route('/customers/add', methods=["POST"])
def add_customer():
    req = request.json
    customer = Customers(req['first_name'], req['last_name'], req['phone'])

    db.session.add(customer)
    db.session.commit()

    return jsonify(customer.id)


@app.route('/customers/del', methods=["POST"])
def del_customer():
    req = request.json

    if 'id' in req.keys():
        customer = Customers.query.get(req['id'])

        if customer == None:
            return jsonify({"id": -1, "error": "Id does not exist"})

        db.session.delete(customer)
        db.session.commit()
        return jsonify({"id": req['id']})

    return jsonify({"id": -1, "error": "Id was not sent in the request"})


@app.route('/orders/')
def get_orders():
    orders = Orders.query.all()

    for i in range(len(orders)):
        orders[i] = orders[i].to_dict()

    return jsonify(orders)


@app.route('/orders/add', methods=["POST"])
def add_order():
    req = request.json
    order = Orders(req['c_id'], req['total'])

    db.session.add(order)
    db.session.commit()

    return jsonify(order.id)


@app.route('/orders/del', methods=["POST"])
def del_order():
    req = request.json

    if 'id' in req.keys():
        order = Orders.query.get(req['id'])

        if order == None:
            return jsonify({"id": -1, "error": "Id does not exist"})

        db.session.delete(order)
        db.session.commit()
        return jsonify({"id": req['id']})

    return jsonify({"id": -1, "error": "Id was not sent in the request"})


@app.route('/orderitems/')
def get_orderitems():
    orders = OrderItems.query.all()

    for i in range(len(orders)):
        orders[i] = orders[i].to_dict()

    return jsonify(orders)


@app.route('/orderitems/add', methods=["POST"])
def add_orderitems():
    req = request.json
    order = OrderItems(req['c_id'], req['o_id'], req["isbn"])

    db.session.add(order)
    db.session.commit()

    return jsonify(order.id)


@app.route('/orderitems/del', methods=["POST"])
def del_orderitems():
    req = request.json

    if 'id' in req.keys():
        order = OrderItems.query.get(req['id'])

        if order == None:
            return jsonify({"id": -1, "error": "Id does not exist"})

        db.session.delete(order)
        db.session.commit()
        return jsonify({"id": req['id']})

    return jsonify({"id": -1, "error": "Id was not sent in the request"})


@app.route('/authors/')
def get_authors():
    authors = Authors.query.all()

    for i in range(len(authors)):
        authors[i] = authors[i].to_dict()

    return jsonify(authors)


@app.route('/authors/add', methods=["POST"])
def add_author():
    req = request.json
    author = Authors(req['name'])

    db.session.add(author)
    db.session.commit()

    return jsonify(author.id)


@app.route('/authors/del', methods=["POST"])
def del_author():
    req = request.json

    if 'id' in req.keys():
        author = Authors.query.get(req['id'])

        if author == None:
            return jsonify({"id": -1, "error": "Id does not exist"})

        db.session.delete(author)
        db.session.commit()
        return jsonify({"id": req['id']})

    return jsonify({"id": -1, "error": "Id was not sent in the request"})


@app.route('/publishers/')
def get_publishers():
    publishers = Publishers.query.all()

    for i in range(len(publishers)):
        publishers[i] = publishers[i].to_dict()

    return jsonify(publishers)


@app.route('/publishers/add', methods=["POST"])
def add_publisher():
    req = request.json
    publisher = Publishers(req['name'])

    db.session.add(publisher)
    db.session.commit()

    return jsonify(publisher.id)


@app.route('/publishers/del', methods=["POST"])
def del_publisher():
    req = request.json

    if 'id' in req.keys():
        publisher = Publishers.query.get(req['id'])

        if publisher == None:
            return jsonify({"id": -1, "error": "Id does not exist"})

        db.session.delete(publisher)
        db.session.commit()
        return jsonify({"id": req['id']})

    return jsonify({"id": -1, "error": "Id was not sent in the request"})

    return jsonify({"id": -1, "error": "Id was not sent in the request"})


@app.route('/books')
def get_books():
    books = Books.query.all()

    for i in range(len(books)):
        books[i] = books[i].to_dict()

    return jsonify(books)


@app.route('/books/add', methods=["POST"])
def add_book():
    req = request.json

    book = Books(req['isbn'], req['name'],
                 req['price'], req['a_id'], req['p_id'])

    db.session.add(book)
    db.session.commit()

    return jsonify(book.isbn)


@app.route('/books/del', methods=["POST"])
def del_book():
    req = request.json
    print(req)

    if 'isbn' in req.keys():
        book = Books.query.get(req['isbn'])

        if book == None:
            return jsonify({"isbn": -1, "error": "ISBN does not exist"})

        db.session.delete(book)
        db.session.commit()
        return jsonify({"isbn": req['isbn']})

    return jsonify({"isbn": -1, "error": "ISBN was not sent in the request"})


if __name__ == '__main__':
    app.run(debug=True, port=5500)
