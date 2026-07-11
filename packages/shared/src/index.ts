// 共通型定義・ユーティリティ

// API レスポンスの共通型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// エラーレスポンスの型
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ページネーションの型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ページネーション付きレスポンス
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
