export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-05'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "sk28QxbJNHQKbIgDAZXuuT88uAM4GsX04oqcR3BOwq99UR8qW0qWkOjMQv8UVDgnUlrOtxOtdgP6iBcVC7fq730Bg0XfvlU6Rih4g6Ca7XByznnMkF9BhiTDxtQ46FrnfCjE050XuXIgUbT1UZEmCNj4DXTkcedVl9v4RpsM9ZVqegSzrqQL",
  'Missing environment variable: NEXT_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
