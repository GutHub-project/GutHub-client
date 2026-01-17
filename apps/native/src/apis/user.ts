import { privateApiInstance } from './instance';

interface ProfileResponse {
  nickname: string;
  ageRange: number;
  gender: string;
  gutType: {
    code: string;
    name: string;
    description: string;
    imageUrl: string;
  };
}

export const userApi = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await privateApiInstance.get<any>('/user/profile');
    return response.data.data;
  },
};
