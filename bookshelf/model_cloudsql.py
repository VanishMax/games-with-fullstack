from flask import Flask
from flask_sqlalchemy import SQLAlchemy

builtin_list = list

db = SQLAlchemy()

def init_app(app):
    # Disable track modifications, as it unnecessarily uses memory.
    app.config.setdefault('SQLALCHEMY_TRACK_MODIFICATIONS', False)
    db.init_app(app)


def from_sql(row):
    """Translates a SQLAlchemy model instance into a dictionary"""
    data = row.__dict__.copy()
    data['id'] = row.id
    data.pop('_sa_instance_state')
    return data


# [START model]
class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    author = db.Column(db.String(255))
    publishedDate = db.Column(db.String(255))
    imageUrl = db.Column(db.String(255))
    description = db.Column(db.String(4096))
    rating = db.Column(db.Float)
    peopleRated = db.Column(db.Integer)

    def __repr__(self):
        return "<Book(title='%s', author=%s)" % (self.title, self.author)

def list(limit=20, cursor=None):
    cursor = int(cursor) if cursor else 0
    query = (Book.query
             .order_by(Book.id)
             .limit(limit)
             .offset(cursor))
    books = builtin_list(map(from_sql, query.all()))
    next_page = cursor + limit if len(books) == limit else None
    return (books, next_page)

def search(search):
    query = (Book.query
             .filter(Book.title.ilike('%' + search + '%') | Book.author.ilike('%' + search + '%'))
             .order_by(Book.id)
             .limit(10))
    books = builtin_list(map(from_sql, query.all()))
    return (books)

def read(id):
    result = Book.query.get(id)
    if not result:
        return None
    return from_sql(result)

def create(data):
    book = Book(**data)
    db.session.add(book)
    db.session.commit()
    return from_sql(book)

def update(data, id):
    book = Book.query.get(id)
    for k, v in data.items():
        setattr(book, k, v)
    db.session.commit()
    result = Book.query.get(id)
    return from_sql(result)

def delete(id):
    Book.query.filter_by(id=id).delete()
    db.session.commit()


def _create_database():
    """
    If this script is run directly, create all the tables necessary to run the
    application.
    """
    app = Flask(__name__)
    app.config.from_pyfile('../config.py')
    init_app(app)
    with app.app_context():
        db.create_all()
    print("All tables created")


if __name__ == '__main__':
    _create_database()
