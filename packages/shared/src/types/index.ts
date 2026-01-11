// Auth 타입
export type {
  SocialProvider,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserProfile,
  AuthState,
  AuthActions,
  AuthStore,
  GutType,
} from './auth';

// API 공통 타입
export type {
  ApiResponse,
  PaginatedResponse,
  CursorPaginatedResponse,
  MealType,
  Gender,
  Nutrient,
  NutrientStatus,
  OverallGutHealthStatus,
} from './api';

export {
  MealTypeLabel,
  GenderLabel,
  NutrientLabel,
  NutrientStatusLabel,
  OverallGutHealthStatusLabel,
} from './api';

// User 타입
export type {
  CheckUsernameRequest,
  CheckUsernameResponse,
  SignupRequest,
  SignupResponse,
  UserInfoResponse,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  DeleteUserRequest,
  ProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  CompleteSignupRequest,
  CompleteSignupResponse,
} from './user';

// Diet 타입
export type {
  Food,
  DietItem,
  DietLog,
  CreateDietRequest,
  UpdateDietRequest,
  NutrientComparison,
  GutHealthAnalysis,
  TotalNutrientInfo,
  CategorizedDietLogs,
  DailyDietResponse,
  DietStreakResponse,
} from './diet';

// Gut Health 타입
export type {
  DailyGutHealthResponse,
  MonthlyGutHealthItem,
  MonthlyGutHealthResponse,
} from './gutHealth';

// Review 타입
export type {
  CreateReviewRequest,
  Review,
  ReviewListResponse,
} from './review';

// Search 타입
export type {
  Supplement,
  ProductSearchResponse,
} from './search';
