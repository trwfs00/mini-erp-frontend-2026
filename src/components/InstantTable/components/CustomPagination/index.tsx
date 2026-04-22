import {
  Group,
  Pagination,
  Select,
  Text,
  type MantineSize,
} from "@mantine/core";
import type { FC } from "react";
import paginationClasses from "./Pagination.module.css";

type Props = {
  state: {
    paginationSize: MantineSize;
    page: number;
    totalPages: number;
    totalRecords: number | undefined;
    recordsPerPage: number | undefined;
    recordsLength: number | undefined;
    fetching: boolean | undefined;
    from?: number;
    to?: number;
    isWrapped: boolean;
  };
  actions: {
    setPage: (page: number) => void;
    setRecordsPerPage?: (n: number) => void;
  };
};

export const CustomPagination: FC<Props> = ({ state, actions }) => {
  return (
    <Group justify="space-between" w="100%" wrap="nowrap">
      <Group gap="sm" wrap="nowrap">
        <Text className={paginationClasses.paginationText}>Rows per page</Text>
        <Select
          size="sm"
          w={72}
          value={String(state.recordsPerPage)}
          disabled={state.totalRecords === 0}
          onChange={(value) => {
            if (value && actions.setRecordsPerPage) {
              actions.setRecordsPerPage(Number(value));
            }
          }}
          data={["10", "20", "50"]}
          classNames={{
            input: paginationClasses.selectInput,
            option: paginationClasses.selectOption,
          }}
          allowDeselect={false}
        />
        <Text className={paginationClasses.paginationText}>
          {state.from || 0} - {state.to || 0} of {state.totalRecords || 0}
        </Text>
      </Group>
      <Pagination
        disabled={state.totalRecords === 0}
        classNames={paginationClasses}
        value={state.page}
        onChange={actions.setPage}
        total={state.totalPages}
        siblings={1}
        boundaries={1}
      />
    </Group>
  );
};
