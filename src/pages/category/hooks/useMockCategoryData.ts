// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import type { CategoryList } from "@/types/category/CategoryList";
import type { GetCategoryListRequest } from "@/services/CategoryService/types/CategoryRequest";
import type { GetCategoryListResponse } from "@/services/CategoryService/types/CategoryResponse";
import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";

type GetMockCategoryListParams = GetCategoryListRequest;

type GetMockCategoryListResponse = {
  data: GetCategoryListResponse;
};

const EMPTY_DATA: GetCategoryListResponse = {
  data: [],
  pagination: {
    total_page: 1,
    total_count: 0,
  },
};

const MOCK_CATEGORY_LIST: CategoryList[] = [
  {
    category_id: "cat1",
    name: "Beverages",
    description: "Drinks and beverages category",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    category_id: "cat2",
    name: "Food",
    description: "Food items category",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    category_id: "cat3",
    name: "Snacks",
    description: "Snack food items",
    created_at: "2024-01-16T11:00:00Z",
    updated_at: "2024-01-16T11:00:00Z",
  },
  {
    category_id: "cat4",
    name: "Dairy",
    description: "Milk and dairy products",
    created_at: "2024-01-17T09:00:00Z",
    updated_at: "2024-01-22T16:45:00Z",
  },
  {
    category_id: "cat5",
    name: "Bakery",
    description: "Bread and baked goods",
    created_at: "2024-01-18T12:00:00Z",
    updated_at: "2024-01-18T12:00:00Z",
  },
  {
    category_id: "cat6",
    name: "Frozen Foods",
    description: "Frozen food products",
    created_at: "2024-01-19T13:00:00Z",
    updated_at: "2024-01-25T09:15:00Z",
  },
  {
    category_id: "cat7",
    name: "Produce",
    description: "Fresh fruits and vegetables",
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z",
  },
  {
    category_id: "cat8",
    name: "Condiments",
    description: "Sauces and condiments",
    created_at: "2024-01-21T15:00:00Z",
    updated_at: "2024-01-28T11:30:00Z",
  },
  {
    category_id: "cat9",
    name: "Beverages",
    description: "Drinks and beverages category",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    category_id: "cat10",
    name: "Food",
    description: "Food items category",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    category_id: "cat11",
    name: "Snacks",
    description: "Snack food items",
    created_at: "2024-01-16T11:00:00Z",
    updated_at: "2024-01-16T11:00:00Z",
  },
  {
    category_id: "cat12",
    name: "Dairy",
    description: "Milk and dairy products",
    created_at: "2024-01-17T09:00:00Z",
    updated_at: "2024-01-22T16:45:00Z",
  },
  {
    category_id: "cat13",
    name: "Bakery",
    description: "Bread and baked goods",
    created_at: "2024-01-18T12:00:00Z",
    updated_at: "2024-01-18T12:00:00Z",
  },
  {
    category_id: "cat14",
    name: "Frozen Foods",
    description: "Frozen food products",
    created_at: "2024-01-19T13:00:00Z",
    updated_at: "2024-01-25T09:15:00Z",
  },
  {
    category_id: "cat15",
    name: "Produce",
    description: "Fresh fruits and vegetables",
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z",
  },
  {
    category_id: "cat16",
    name: "Condiments",
    description: "Sauces and condiments",
    created_at: "2024-01-21T15:00:00Z",
    updated_at: "2024-01-28T11:30:00Z",
  },
  {
    category_id: "cat17",
    name: "Beverages",
    description: "Drinks and beverages category",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    category_id: "cat18",
    name: "Food",
    description: "Food items category",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    category_id: "cat19",
    name: "Snacks",
    description: "Snack food items",
    created_at: "2024-01-16T11:00:00Z",
    updated_at: "2024-01-16T11:00:00Z",
  },
  {
    category_id: "cat20",
    name: "Dairy",
    description: "Milk and dairy products",
    created_at: "2024-01-17T09:00:00Z",
    updated_at: "2024-01-22T16:45:00Z",
  },
  {
    category_id: "cat21",
    name: "Bakery",
    description: "Bread and baked goods",
    created_at: "2024-01-18T12:00:00Z",
    updated_at: "2024-01-18T12:00:00Z",
  },
];

export const useMockCategoryData = () => {
  const getMockCategoryList = async ({
    page,
    limit,
    criteria,
  }: GetMockCategoryListParams): Promise<GetMockCategoryListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    if (MOCK_CATEGORY_LIST.length === 0) {
      return { data: EMPTY_DATA };
    }

    const search = criteria?.search?.toLowerCase().trim() ?? "";

    const filtered = search
      ? MOCK_CATEGORY_LIST.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search),
        )
      : MOCK_CATEGORY_LIST;

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    const total = filtered.length;

    return {
      data: {
        data: paginated,
        pagination: {
          total_page: Math.ceil(total / limit) || 1,
          total_count: total,
        },
      },
    };
  };

  return { getMockCategoryList };
};
