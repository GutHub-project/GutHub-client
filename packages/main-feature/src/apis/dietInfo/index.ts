import { privateApiInstance } from "@repo/shared";

export const dietApi = {
  getDiet: async (date: string) => {
    const response = await privateApiInstance.get(`/api/diets?date=${date}`);
    return response.data;
  }
}