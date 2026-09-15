import React, { useMemo, useCallback } from "react";
import type {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from "antd/es/table/interface";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export interface IGetQuery {
  limit: number;
  offset: number; // treat as 1-based page number
  sortOrder?: "asc" | "desc";
  sortBy?: string;
  search?: string;
  filters?: Record<string, string>;
}

const getQueryJSON = (searchParams: URLSearchParams): IGetQuery => {
  const order = searchParams.get("sortOrder");
  const filters: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    if (key.startsWith("filters[")) {
      const match = /\[(.*?)\]/.exec(key);
      if (match) {
        filters[match[1]] = value;
      }
    }
  });

  return {
    limit: Number(searchParams.get("limit") || 10),
    offset: Number(searchParams.get("offset") || 1), // keep 1-based
    sortOrder: order as "asc" | "desc" | undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    search: searchParams.get("search") || undefined,
    filters,
  };
};

export interface TableQueryInjectedProps {
  params: IGetQuery;
  queryString: string;
  onSearch: (q: string) => void;
  onChange: (
    pagination?: TablePaginationConfig,
    filters?: Record<string, FilterValue | null>,
    sorter?: SorterResult<any> | SorterResult<any>[],
    tabKey?: string
  ) => void;
  onTabChange: (tabKey: string) => void;
}

const AntSorterConvert = {
  ascend: "asc",
  descend: "desc",
} as const;

export function TableQueryHOC<P>(
  WrappedComponent: React.ComponentType<P & TableQueryInjectedProps>
): React.FC<P> {
  return function WithExtraProps(props: P) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ memoize parsed query params
    const params = useMemo(() => getQueryJSON(searchParams), [searchParams]);

    const replaceQuery = useCallback(
      (newParams: URLSearchParams) => {
        navigate(`${location.pathname}?${newParams.toString()}`, {
          replace: true,
        });
      },
      [navigate, location.pathname]
    );

    const onSearch = useCallback(
      (search: string): void => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (search) newParams.set("search", search);
        else newParams.delete("search");
        newParams.set("offset", "1"); // reset to first page
        replaceQuery(newParams);
      },
      [searchParams, replaceQuery]
    );

    const onTabChange = useCallback(
      (tabKey: string): void => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("tabKey", tabKey);
        replaceQuery(newParams);
      },
      [searchParams, replaceQuery]
    );

    const onChange = useCallback(
      (
        pagination?: TablePaginationConfig,
        filters?: Record<string, FilterValue | null>,
        sorter?: SorterResult<any> | SorterResult<any>[],
        tabKey?: string
      ): void => {
        const newParams = new URLSearchParams(searchParams.toString());

        // keep search text
        if (params.search) newParams.set("search", params.search);

        // clear filters
        newParams.forEach((_, key) => {
          if (key.startsWith("filters[")) newParams.delete(key);
        });

        // apply filters
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            value?.forEach((val) => {
              newParams.append(`filters[${key}]`, val.toString());
            });
          });
        }

        // apply sorter
        if (sorter && !(sorter instanceof Array)) {
          const key = sorter.columnKey?.toString();
          if (key && sorter.order) {
            newParams.set("sortBy", key);
            newParams.set("sortOrder", AntSorterConvert[sorter.order]);
          } else {
            newParams.delete("sortBy");
            newParams.delete("sortOrder");
          }
        }

        // apply pagination (AntD pagination is 1-based)
        if (pagination?.pageSize)
          newParams.set("limit", pagination.pageSize.toString());
        if (pagination?.current)
          newParams.set("offset", pagination.current.toString());

        if (tabKey) newParams.set("tabKey", tabKey);

        replaceQuery(newParams);
      },
      [searchParams, params.search, replaceQuery]
    );

    return (
      <WrappedComponent
        {...props}
        params={params}
        queryString={searchParams.toString()}
        onSearch={onSearch}
        onChange={onChange}
        onTabChange={onTabChange}
      />
    );
  };
}
