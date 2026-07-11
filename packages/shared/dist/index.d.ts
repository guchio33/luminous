export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
//# sourceMappingURL=index.d.ts.map
