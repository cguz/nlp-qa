from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
con = sqlite3.connect('mydatabase.db')

c = con.cursor()

# Create a table
c.execute('''CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    type TEXT NOT NULL
  );''')

# Commit changes and close the connection
con.commit()
con.close()

# home page route
@app.route('/')
def home():
    # connect to db and select all data
    con = sqlite3.connect('mydatabase.db')
    cur = con.cursor()
    cur.execute('SELECT * FROM questions')

    # data = cur.fetchall()
    # Fetch all the rows and convert to a list of dictionaries
    data = cur.fetchall()
    con.close()
    return render_template('home.html', data=data) 

# home page route
@app.route('/json')
def json():
    # connect to db and select all data
    con = sqlite3.connect('mydatabase.db')
    cur = con.cursor()
    cur.execute('SELECT * FROM questions')

    # Fetch all the rows and convert to a list of dictionaries
    rows = cur.fetchall()
    data = []
    for row in rows:
        result = {}
        result['question'] = row[1]
        result['answer'] = row[2]
        result['type'] = row[3]
        data.append(result)

    con.close()
    return data 


# insert page route
@app.route('/insert', methods=['GET', 'POST'])
def insert():
    if request.method == 'POST':
        # get data from form
        question = request.form['question']
        answer = request.form['answer']
        question_type = request.form['question_type']
        # connect to db and insert data
        con = sqlite3.connect('mydatabase.db')
        cur = con.cursor()
        cur.execute('INSERT INTO questions (question, answer, type) VALUES (?, ?, ?)', (question, answer, question_type))
        con.commit()
        con.close()
        return redirect(url_for('home'))
    else:
        return render_template('insert.html')

# modify page route
@app.route('/modify/<int:id>', methods=['GET', 'POST'])
def modify(id):
    if request.method == 'POST':
        # get data from form
        question = request.form['question']
        answer = request.form['answer']
        question_type = request.form['question_type']
        # connect to db and modify data
        con = sqlite3.connect('mydatabase.db')
        cur = con.cursor()
        cur.execute('UPDATE questions SET question=?, answer=?, type=? WHERE id=?', (question, answer, question_type, id))
        con.commit()
        con.close()
        return redirect(url_for('home'))
    else:
        # connect to db and select data by id
        con = sqlite3.connect('mydatabase.db')
        cur = con.cursor()
        cur.execute('SELECT * FROM questions WHERE id=?', (id,))
        data = cur.fetchone()
        con.close()
        return render_template('modify.html', data=data)

# remove route
@app.route('/remove/<int:id>')
def remove(id):
    # connect to db and remove data by id
    con = sqlite3.connect('mydatabase.db')
    cur = con.cursor()
    cur.execute('DELETE FROM questions WHERE id=?', (id,))
    con.commit()
    con.close()
    return redirect(url_for('home'))

