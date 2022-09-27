from xml.dom import ValidationErr
import torch
import yaml
import numpy as np
import onnxruntime as ort

from functools import reduce
from torch.nn.functional import softmax


class Agent:
    def __init__(
        self,
        config_path: str = "onnx_model/onnx_model.yaml",
        model_path: str = "onnx_model/onnx_model.onnx",
    ):
        with open(config_path, "r") as f:
            self.config = yaml.safe_load(f)
        self.ort_session = ort.InferenceSession(model_path)

    @staticmethod
    def _trajectory_fromula(prev, next, agg_type="subs"):
        if agg_type == "subs":
            return next - prev
        if agg_type == "subs_with_discount":
            return (next - prev) * 0.9

    def _get_action(self, obs):
        action, _ = self.ort_session.run(None, {"input": [obs]})
        res = torch.normal(mean=torch.tensor(action))[0].tolist()
        return res

    def __call__(self, previous_questions_vecs):
        prev_trajectory = reduce(
            lambda p1, p2: self._trajectory_fromula(
                p1, p2, agg_type=self.config["agg_type"]
            ),
            np.array(previous_questions_vecs),
        )

        prev_trajectory = np.array(prev_trajectory).astype(np.float32)
        return self._get_action(prev_trajectory)
