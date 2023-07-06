import subprocess
from flask import Flask, redirect, url_for
from jinja2 import Environment, PackageLoader, select_autoescape
from markdo import Markdo, print_tree


app = Flask(__name__)

# editor_cmd = "C:/Program Files (x86)/Notepad++/notepad++.exe {file} -n{line}"
path = "./examples/example.md"
editor_cmd = "xed {file} +{line}"

env = Environment(
    loader=PackageLoader("app"),
    autoescape=select_autoescape()
)


@app.route("/")
def index():
    markdo = Markdo(open(path).read())
    root = markdo.root
    print_tree(root)
    return env.get_template("page.html.jinja").render(root=root)


@app.route("/edit/<line>/anchor/<anchor>")
def edit_at_line(line, anchor):
    line_num = int(line[1:]) + 1
    cmd = editor_cmd.replace("{file}", path).replace("{line}", str(line_num))
    print(cmd)

    subprocess.run(cmd.split(" "))
    return redirect(url_for('index', _anchor=anchor))
