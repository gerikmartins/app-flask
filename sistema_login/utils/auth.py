from functools import wraps
from flask import flash, redirect, url_for
from flask_login import current_user

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.tipo_usuario != 'admin':
            flash('Acesso negado. Área restrita para administradores.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def terapeuta_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.tipo_usuario != 'terapeuta':
            flash('Acesso negado. Área restrita para terapeutas.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function