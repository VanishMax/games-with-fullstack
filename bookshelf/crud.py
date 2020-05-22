from bookshelf import get_model
from flask import Blueprint, redirect, render_template, request, url_for


crud = Blueprint('crud', __name__)

@crud.route('/')
def index():
    return render_template("index.html")

@crud.route('/list')
def get_books():
    books, next_page_token = get_model().list()
    return {"data": books, "status": 200}

@crud.route('/books')
def search_books():
    search = request.args.get('search', None)
    print(search)
    books = get_model().search(search)
    return {"data": books, "status": 200}


@crud.route('/book/<id>')
def get_book(id):
    book = get_model().read(id)
    return {"status": 200, "data": book}


@crud.route('/add', methods=['POST'])
def add():
    data = request.get_json()
    book = get_model().create(data)
    if not book:
        return {"status": 400, "data": None}
    return {"status": 200, "data": book}


@crud.route('/books/<id>', methods=['PUT'])
def edit(id):
    data = request.get_json()
    book = get_model().update(data, id)
    if not book:
        return {"status": 400, "data": None}
    return {"status": 200, "data": book}


@crud.route('/books/<id>', methods=['DELETE'])
def delete(id):
    get_model().delete(id)
    return {"status": 201}
