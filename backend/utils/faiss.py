import faiss
import numpy as np
from sklearn.neighbors import NearestNeighbors
from functools import lru_cache

from dbase import db


@lru_cache(maxsize=4)
def get_vecs(language: str):
    X = db.engine.execute(f"select {language} from phrases_vec").all()
    X = np.array([i[0] for i in X])
    return X


def get_closest_vector_knn(language, vec, n_neighbors=15):
    X = get_vecs(language)

    knn_model = NearestNeighbors(n_neighbors=n_neighbors)
    knn_model.fit(X)

    distances, indices = knn_model.kneighbors([vec], return_distance=True)
    distances = distances[0]
    indices = indices[0] + 1  # +1 is because phrases enumeration starts from 1...

    return indices, distances


# TODO ... Needed debug. DB object replication problem.
def get_closest_vector_faiss(language, vec, n_neighbors=15):
    X = get_vecs(language)

    emb_size = X[0].shape[-1]
    index = faiss.IndexFlatL2(emb_size)
    index.add(X)

    vec = np.array([vec])
    _, indices = index.search(vec, n_neighbors + 1)
    indices = indices[0][1:] + 1  # +1 is because phrases enumeration starts from 1...

    return indices, X[indices - 1]
