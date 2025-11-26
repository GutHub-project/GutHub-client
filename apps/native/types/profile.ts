export type AgeGroup = '10대' | '20대' | '30대' | '40대' | '50대 이상';

export type Gender = '남성' | '여성';

export type GutHealthType = '건강형' | '변비형' | '설사형' | '가스,복부팽만형';

export interface ProfileData {
  nickname: string;
  ageGroup: AgeGroup;
  gender: Gender;
  gutHealthType: GutHealthType;
  profileImage?: string;
}
