import traceback

from flask import request, jsonify
from flasgger.utils import swag_from

from . import api, agent


@api.route("/get_pair", methods=["POST"])
@swag_from("swaggers/get_pair_api.yml")
def get_pair_api():
    try:
        req = request.get_json()
        previous_questions_vecs = req["prev_vecs"]

        # choose question
        next_vector = agent(previous_questions_vecs)

        return jsonify(
            {
                "status": 200,
                "next_vector": next_vector,
            }
        )
    except Exception as e:
        return jsonify(
            {
                "status": 500,
                "message": f"Server internal error. {e}",
                "traceback": f"{traceback.format_exc()}",
            }
        )
