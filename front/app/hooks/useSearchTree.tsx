"use client";

import { useState, useEffect } from "react";

const useSearchTree = (accessToken: string) => {
  const [treeId, setTreeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/exist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await res.json();
        setTreeId(data.treeId);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err : new Error("에러발생"));
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchTree();
    }
  }, [accessToken]);

  return { treeId, loading, error };
};

export default useSearchTree;
