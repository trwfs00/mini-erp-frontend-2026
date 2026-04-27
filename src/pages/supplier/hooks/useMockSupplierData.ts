// TODO: ลบไฟล์นี้เมื่อ integrate API จริง

import { MOCK_DELAY_MS } from "@/consts/api/mockDelay";
import type { GetSupplierListRequest } from "@/services/SupplierService/types/SupplierRequest";
import type { GetSupplierListResponse } from "@/services/SupplierService/types/SupplierResponse";
import type { SupplierList } from "@/types/supplier/SupplierList";

type GetMockSupplierListParams = GetSupplierListRequest;

type GetMockSupplierListResponse = {
  data: GetSupplierListResponse;
};

const EMPTY_DATA: GetSupplierListResponse = {
  data: [],
  pagination: {
    total_page: 1,
    total_count: 0,
  },
};

const MOCK_SUPPLIER_LIST: SupplierList[] = [
  {
    supplier_id: "sup1",
    name: "Bangkok Beverages Co., Ltd.",
    phone: "02-345-6789",
    email: "contact@bkkbev.co.th",
    address: "123 Sukhumvit Rd., Bangkok 10110",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-10T09:00:00Z",
  },
  {
    supplier_id: "sup2",
    name: "Thai Snack Distributors",
    phone: "02-987-6543",
    email: "sales@thaisnack.co.th",
    address: "45 Rama 9 Rd., Bangkok 10310",
    created_at: "2024-01-12T10:30:00Z",
    updated_at: "2024-02-15T14:00:00Z",
  },
  {
    supplier_id: "sup3",
    name: "Fresh Dairy Supply",
    phone: "02-111-2222",
    email: "info@freshdairy.co.th",
    address: "78 Ratchada Rd., Bangkok 10310",
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:00:00Z",
  },
  {
    supplier_id: "sup4",
    name: "Golden Bakery Wholesale",
    phone: "02-333-4444",
    email: "orders@goldenbakery.co.th",
    address: "910 Lat Phrao Rd., Bangkok 10230",
    created_at: "2024-01-18T08:00:00Z",
    updated_at: "2024-03-01T09:15:00Z",
  },
  {
    supplier_id: "sup5",
    name: "Frozen Foods Asia",
    phone: "02-555-6666",
    email: "asia@frozenfoods.com",
    address: "12 Bang Na Rd., Bangkok 10260",
    created_at: "2024-01-20T13:00:00Z",
    updated_at: "2024-01-20T13:00:00Z",
  },
  {
    supplier_id: "sup6",
    name: "Country Produce Cooperative",
    phone: "053-222-1111",
    email: "coop@countryproduce.co.th",
    address: "200 Chiang Mai-Lampang Rd., Chiang Mai 50000",
    created_at: "2024-01-22T07:30:00Z",
    updated_at: "2024-02-10T16:45:00Z",
  },
  {
    supplier_id: "sup7",
    name: "Premium Condiments Trading",
    phone: "02-777-8888",
    email: "premium@condiments.co.th",
    address: "33 Phetkasem Rd., Bangkok 10160",
    created_at: "2024-01-25T15:00:00Z",
    updated_at: "2024-01-25T15:00:00Z",
  },
  {
    supplier_id: "sup8",
    name: "Eastern Logistics Partner",
    phone: "038-444-5555",
    email: "ops@easternlog.co.th",
    address: "56 Sukhumvit Rd., Chonburi 20000",
    created_at: "2024-02-01T09:00:00Z",
    updated_at: "2024-03-12T10:00:00Z",
  },
  {
    supplier_id: "sup9",
    name: "North Highlands Coffee",
    phone: "053-666-7777",
    email: "beans@nhcoffee.co.th",
    address: "88 Mae Rim Rd., Chiang Mai 50180",
    created_at: "2024-02-05T08:30:00Z",
    updated_at: "2024-02-05T08:30:00Z",
  },
  {
    supplier_id: "sup10",
    name: "Sunshine Fruits Import",
    phone: "02-888-9999",
    email: "import@sunshinefruits.co.th",
    address: "401 Bangna-Trad Rd., Samut Prakan 10540",
    created_at: "2024-02-08T11:30:00Z",
    updated_at: "2024-04-01T09:00:00Z",
  },
];

export const useMockSupplierData = () => {
  const getMockSupplierList = async ({
    page,
    limit,
    criteria,
    sort_bys,
  }: GetMockSupplierListParams): Promise<GetMockSupplierListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    if (MOCK_SUPPLIER_LIST.length === 0) {
      return { data: EMPTY_DATA };
    }

    const search = criteria?.search?.toLowerCase().trim() ?? "";

    const filtered = search
      ? MOCK_SUPPLIER_LIST.filter(
          (s) =>
            s.name.toLowerCase().includes(search) ||
            s.email.toLowerCase().includes(search) ||
            s.phone.toLowerCase().includes(search),
        )
      : [...MOCK_SUPPLIER_LIST];

    const sort = sort_bys?.[0];
    if (sort?.field && sort.direction) {
      const field = sort.field as keyof SupplierList;
      const dir = sort.direction === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av == null && bv == null) return 0;
        if (av == null) return -1 * dir;
        if (bv == null) return 1 * dir;
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }

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

  return { getMockSupplierList };
};
