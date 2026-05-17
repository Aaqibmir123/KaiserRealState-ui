import { baseApi } from './baseApi';

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    getTestimonials: build.query({
      query: () => ({ url: '/testimonials' }),
      providesTags: ['Testimonial']
    }),
    getAdminTestimonials: build.query({
      query: () => ({ url: '/admin/testimonials' }),
      providesTags: ['Testimonial']
    }),
    createTestimonial: build.mutation({
      query: (body: any) => ({ url: '/admin/testimonials', method: 'POST', body }),
      invalidatesTags: ['Testimonial']
    }),
    updateTestimonial: build.mutation({
      query: ({ id, ...body }: any) => ({ url: `/admin/testimonials/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['Testimonial']
    }),
    deleteTestimonial: build.mutation({
      query: (id: string) => ({ url: `/admin/testimonials/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Testimonial']
    })
  })
});

export const {
  useGetTestimonialsQuery,
  useGetAdminTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation
} = testimonialApi;
