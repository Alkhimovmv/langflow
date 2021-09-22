from main import get_languages_pair
from flask import Flask, render_template, url_for, request, redirect

app = Flask(__name__)


@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        return redirect("/practice")
    return render_template("index.html")


@app.route("/practice", methods=["POST", "GET"])
def home():
    first_language, second_language = get_languages_pair(
        "english",
        "french",
        "level1",
    )
    second_language_answer = ""
    if request.method == "POST":
        second_language_answer = request.form["second_language_answer"]

    return render_template(
        "practice.html",
        first_language=first_language,
        second_language_answer=second_language_answer,
        second_language=second_language,
    )


if __name__ == "__main__":
    app.run(host="localhost", port=6767, debug=True)
