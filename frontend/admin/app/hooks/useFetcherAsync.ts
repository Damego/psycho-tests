import React, { useCallback, useEffect, useRef } from "react";
import { SubmitFunction, useFetcher } from "@remix-run/react";

/*
 Асинхронная версия хука useFetcher. Главное отличие в том, что функция submit теперь возращает данные, полученные от сервера
 Взято отсюда: https://gist.github.com/samselikoff/510c020e4c9ec17f1cf76189ce683fa8
 */
const useFetcherAsync = <T>() => {
  const resolveRef = useRef<(value: T) => void>();
  const promiseRef = useRef<Promise<T>>();
  const fetcher = useFetcher();

  if (!promiseRef.current) {
    promiseRef.current = new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }

  const resetResolver = useCallback(() => {
    promiseRef.current = new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, [promiseRef, resolveRef]);

  const submit = useCallback(
    async (...args: Parameters<SubmitFunction>) => {
      fetcher.submit(...args);
      return promiseRef.current;
    },
    [fetcher, promiseRef]
  );

  useEffect(() => {
    if (fetcher.data) {
      resolveRef.current!(fetcher.data as T);
      resetResolver();
    }
  }, [fetcher, promiseRef]);

  return { ...fetcher, submit };
};

export default useFetcherAsync;
