# Projeto Flask

## Clonando o Repositório

Para iniciar, clone este repositório em sua máquina local:

```bash
git clone https://github.com/gerikmartins/app-flask.git
```

Entre no diretório do projeto:

```bash
cd app-flask
```

## Verificando a Instalação do Python

Verifique se o Python está instalado executando o seguinte comando:

```bash
python --version  # ou python3 --version
```

Se o Python não estiver instalado, faça o download e instale-o pelo site oficial:
[Python.org](https://www.python.org/downloads/)

## Criando e Ativando um Ambiente Virtual (venv)

Crie um ambiente virtual na pasta inicial do projeto:

### No Linux/macOS:
```bash
python3 -m venv venv
source venv/bin/activate
```

### No Windows:
```powershell
python -m venv venv
venv\Scripts\activate
```

O terminal deve indicar que o ambiente virtual está ativado.

## Instalando as Dependências

Com o ambiente virtual ativado, instale as dependências do projeto:

```bash
pip install -r requirements.txt
```

## Executando o Projeto

Entre na pasta `sistema_login`:

```bash
cd sistema_login
```

Inicie a aplicação executando o comando:

```bash
python app.py
```

A aplicação estará rodando e pronta para uso!

## Fim

O projeto ainda está em desenvolvimento, aguarde novas versões ;)

