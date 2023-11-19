import { fetchWithTokenCheck } from "../components/FetchWithTokenCheck";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const fetchTreeData = async (
  userToken: string,
  router: AppRouterInstance
) => {
  if (!userToken) return null; // userToken이 없으면 null 반환
  try {
    let url = `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree`;
    const response = await fetchWithTokenCheck(
      url,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
      router
    );
    const data = await response.json();
    return data.tree;
  } catch (error) {
    console.error(error);
    throw error; // 오류를 상위 컴포넌트로 전파
  }
};
