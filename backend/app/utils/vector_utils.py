# ============================================================
# backend/app/utils/vector_utils.py
# ============================================================
"""
向量处理工具
"""
import numpy as np
from typing import List, Tuple

class VectorUtils:
    """向量处理工具类"""
    
    @staticmethod
    def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """
        计算余弦相似度
        
        Args:
            vec1: 向量1
            vec2: 向量2
            
        Returns:
            相似度分数
        """
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return float(dot_product / (norm1 * norm2))
    
    @staticmethod
    def normalize_vector(vec: np.ndarray) -> np.ndarray:
        """
        归一化向量
        
        Args:
            vec: 输入向量
            
        Returns:
            归一化后的向量
        """
        norm = np.linalg.norm(vec)
        if norm == 0:
            return vec
        return vec / norm
    
    @staticmethod
    def euclidean_distance(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """
        计算欧氏距离
        
        Args:
            vec1: 向量1
            vec2: 向量2
            
        Returns:
            欧氏距离
        """
        return float(np.linalg.norm(vec1 - vec2))
    
    @staticmethod
    def find_top_k_similar(
        query_vector: np.ndarray,
        vectors: List[np.ndarray],
        k: int = 5
    ) -> List[Tuple[int, float]]:
        """
        找到最相似的K个向量
        
        Args:
            query_vector: 查询向量
            vectors: 向量列表
            k: 返回数量
            
        Returns:
            (索引, 相似度)列表
        """
        similarities = []
        for idx, vec in enumerate(vectors):
            sim = VectorUtils.cosine_similarity(query_vector, vec)
            similarities.append((idx, sim))
        
        # 按相似度降序排序
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:k]
