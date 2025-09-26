from flask import Flask, render_template, request, session, redirect, url_for,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from functools import wraps
import ollama

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'summarizer_secret_key'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated

@app.route('/', methods=['GET'])
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful'})
    return jsonify({'error': 'Invalid username or password'}), 401


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')

    
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Signup successful'})


# Logout
@app.route('/logout')
@login_required
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/index', methods=['GET'])
@login_required
def index():
    return render_template('index.html')


@app.route('/summarize', methods=['POST'])
@login_required
def summarize():
    sql_query = request.form.get('query', '').strip()
    if not sql_query:
        return {"error": "Please input a SQL query"}, 400

    
    prompt = f"Explain this SQL query in plain English:\n\n{sql_query}"
    response = ollama.chat(
        model="llama3.2",
        messages=[
            {"role": "system", "content": "You are an expert SQL tutor. Summarize queries clearly."},
            {"role": "user", "content": prompt}
        ]
    )
    summary = response['message']['content']
    return {"summary": summary}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    
