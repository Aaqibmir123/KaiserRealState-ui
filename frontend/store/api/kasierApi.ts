import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/constants/api";
import type {
  AdminAuthUser,
  DashboardSummary,
  InquiryRecord,
  LandRecord,
  OwnerProfile,
  SoldRecord,
  TestimonialRecord,
} from "@/types";
import type {
  InquiryInput,
  LandInput,
  LoginInput,
  OwnerInput,
  SoldInput,
  TestimonialInput,
} from "@/lib/validators";

type LandPayload = LandInput;

export type AuthResponse = { authenticated: true; user: AdminAuthUser } | { authenticated: false; user: null };

type ApiDeleteResult = { ok: true };

export const kasierApi = createApi({
  reducerPath: "kasierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Auth", "Summary", "Land", "Sold", "Testimonial", "Inquiry", "Owner"],
  endpoints: (build) => ({
    me: build.query<AuthResponse, void>({
      query: () => "auth/me",
      providesTags: ["Auth"],
    }),
    login: build.mutation<{ user: AdminAuthUser }, LoginInput>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: build.mutation<ApiDeleteResult, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    refresh: build.mutation<AuthResponse, void>({
      query: () => ({
        url: "auth/refresh",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    getSummary: build.query<DashboardSummary, void>({
      query: () => "admin/summary",
      providesTags: ["Summary"],
    }),
    getLands: build.query<LandRecord[], void>({
      query: () => "admin/lands",
      providesTags: (result) =>
        result
          ? [{ type: "Land", id: "LIST" }, ...result.map((item) => ({ type: "Land" as const, id: item.id }))]
          : [{ type: "Land", id: "LIST" }],
    }),
    createLand: build.mutation<LandRecord, LandPayload>({
      query: (body) => ({
        url: "admin/lands",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Land", id: "LIST" }, "Summary"],
    }),
    updateLand: build.mutation<LandRecord, Partial<LandPayload> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `admin/lands/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Land", id },
        { type: "Land", id: "LIST" },
        "Summary",
      ],
    }),
    deleteLand: build.mutation<ApiDeleteResult, string>({
      query: (id) => ({
        url: `admin/lands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Land", id },
        { type: "Land", id: "LIST" },
        "Summary",
      ],
    }),
    getSoldRecords: build.query<SoldRecord[], void>({
      query: () => "admin/sold",
      providesTags: (result) =>
        result
          ? [{ type: "Sold", id: "LIST" }, ...result.map((item) => ({ type: "Sold" as const, id: item.id }))]
          : [{ type: "Sold", id: "LIST" }],
    }),
    createSoldRecord: build.mutation<SoldRecord, SoldInput>({
      query: (body) => ({
        url: "admin/sold",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Sold", id: "LIST" }, "Summary"],
    }),
    deleteSoldRecord: build.mutation<ApiDeleteResult, string>({
      query: (id) => ({
        url: `admin/sold/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Sold", id },
        { type: "Sold", id: "LIST" },
        "Summary",
      ],
    }),
    getTestimonials: build.query<TestimonialRecord[], void>({
      query: () => "admin/testimonials",
      providesTags: (result) =>
        result
          ? [
              { type: "Testimonial", id: "LIST" },
              ...result.map((item) => ({ type: "Testimonial" as const, id: item.id })),
            ]
          : [{ type: "Testimonial", id: "LIST" }],
    }),
    createTestimonial: build.mutation<TestimonialRecord, TestimonialInput>({
      query: (body) => ({
        url: "admin/testimonials",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }, "Summary"],
    }),
    updateTestimonial: build.mutation<TestimonialRecord, Partial<TestimonialInput> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `admin/testimonials/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Testimonial", id },
        { type: "Testimonial", id: "LIST" },
        "Summary",
      ],
    }),
    deleteTestimonial: build.mutation<ApiDeleteResult, string>({
      query: (id) => ({
        url: `admin/testimonials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Testimonial", id },
        { type: "Testimonial", id: "LIST" },
        "Summary",
      ],
    }),
    getInquiries: build.query<InquiryRecord[], void>({
      query: () => "admin/inquiries",
      providesTags: (result) =>
        result
          ? [{ type: "Inquiry", id: "LIST" }, ...result.map((item) => ({ type: "Inquiry" as const, id: item.id }))]
          : [{ type: "Inquiry", id: "LIST" }],
    }),
    createInquiry: build.mutation<InquiryRecord, InquiryInput>({
      query: (body) => ({
        url: "admin/inquiries",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Inquiry", id: "LIST" }, "Summary"],
    }),
    updateInquiry: build.mutation<InquiryRecord, Partial<InquiryInput> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `admin/inquiries/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Inquiry", id },
        { type: "Inquiry", id: "LIST" },
        "Summary",
      ],
    }),
    deleteInquiry: build.mutation<ApiDeleteResult, string>({
      query: (id) => ({
        url: `admin/inquiries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Inquiry", id },
        { type: "Inquiry", id: "LIST" },
        "Summary",
      ],
    }),
    getOwnerProfile: build.query<OwnerProfile, void>({
      query: () => "admin/owner",
      providesTags: ["Owner"],
    }),
    updateOwnerProfile: build.mutation<OwnerProfile, Partial<OwnerInput>>({
      query: (body) => ({
        url: "admin/owner",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Owner"],
    }),
  }),
});

export const {
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetSummaryQuery,
  useGetLandsQuery,
  useCreateLandMutation,
  useUpdateLandMutation,
  useDeleteLandMutation,
  useGetSoldRecordsQuery,
  useCreateSoldRecordMutation,
  useDeleteSoldRecordMutation,
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetInquiriesQuery,
  useCreateInquiryMutation,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
  useGetOwnerProfileQuery,
  useUpdateOwnerProfileMutation,
} = kasierApi;
