class User:
    def __init__(self, id, email, tipo_usuario):
        self.id = id
        self.email = email
        self.tipo_usuario = tipo_usuario

    def is_admin(self):
        return self.tipo_usuario == 'admin'

    def is_terapeuta(self):
        return self.tipo_usuario == 'terapeuta'

    def is_paciente(self):
        return self.tipo_usuario == 'paciente'