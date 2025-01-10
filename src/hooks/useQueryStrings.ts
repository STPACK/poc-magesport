/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type QueryParamType = string | number | boolean | string[];

export function useQueryStrings<T extends Record<string, QueryParamType>>(
  initialValue: T
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchObj, setSearchObj] = useState<T>(initialValue);

  useEffect(() => {
    setSearchObj((prev) => ({
      ...prev,
      ...convertQueryStringsToObj(searchParams),
    }));
  }, [searchParams]);

  function convertQueryStringsToObj(params: URLSearchParams): Partial<T> {
    const result = {} as Partial<T>;
    // หาว่า key ไหน ควรจะเป็น number, boolean, array หรือ string
    for (const key in initialValue) {
      if (params.has(key)) {
        const value = params.get(key);

        if (typeof initialValue[key] === "number") {
          result[key] = value
            ? (Number(value) as T[typeof key])
            : (undefined as any);
        } else if (typeof initialValue[key] === "boolean") {
          result[key] = (value === "true") as T[typeof key];
        } else if (Array.isArray(initialValue[key])) {
          result[key] = value
            ? (value.split(",") as T[typeof key])
            : ([] as any);
        } else {
          result[key] = (value as T[typeof key]) || ("" as any);
        }
      } else {
        // If the parameter is not present in the URL, retain the initial value
        result[key] = initialValue[key];
      }
    }

    return result;
  }

  function updateQueryStrings(newParams: Partial<T>) {
    setSearchObj(newParams as T);
    const newQueryStrings = new URLSearchParams();

    Object.keys(newParams).forEach((key) => {
      const value = newParams[key as keyof T];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          newQueryStrings.set(key, value.join(","));
        } else {
          newQueryStrings.delete(key);
        }
      } else if (typeof value === "boolean") {
        newQueryStrings.set(key, value.toString());
      } else if (
        (typeof value === "string" || typeof value === "number") &&
        value !== ""
      ) {
        newQueryStrings.set(key, value.toString());
      } else {
        newQueryStrings.delete(key);
      }
    });

    router.replace(`?${newQueryStrings.toString()}`, {
      scroll: false,
    });
  }

  return {
    searchObj,
    updateQueryStrings,
  };
}
