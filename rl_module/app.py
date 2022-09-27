import time
from flask import Flask
from flasgger import Swagger

time.sleep(3)

from api import api


app = Flask(__name__)
app.register_blueprint(api)
Swagger(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6768, debug=True)
