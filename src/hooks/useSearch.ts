import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import get from "lodash/get";

interface FilterConfig<T> {
  fields: string[] | Array<keyof T>;
}

const useSearch = <T>(
  data: T[],
  config: FilterConfig<T>,
  delay: number = 300
) => {
  const [query, setQuery] = useState<string>("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const filterData = useCallback(
    (searchValue: string) => {
      const lowercasedValue = searchValue.toLowerCase();
      const result = data.filter((item) =>
        config.fields.some((field) =>
          deepSearch(item, String(field), lowercasedValue)
        )
      );
      setFilteredData(result);
    },
    [data]
  );
  const deepSearch = (item: T, field: string, value: string): boolean => {
    const fieldValue = get(item, field);
    if (fieldValue !== undefined) {
      const stringValue = String(fieldValue).toLowerCase();
      return stringValue.includes(value);
    }
    return false;
  };

  // eslint-disable-next-line react-hooks/use-memo
  const debouncedFilter = useCallback(debounce(filterData, delay), [
    filterData,
    delay,
  ]);

  useEffect(() => {
    debouncedFilter(query);
    return () => {
      debouncedFilter.cancel();
    };
  }, [debouncedFilter, query]);

  return {
    query,
    setQuery,
    filteredData,
  };
};

export default useSearch;
