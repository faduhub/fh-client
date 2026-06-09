const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${path}`);
  }

  return res.json();
}

type ListResult<T> = { success: boolean; total: number; data: T[] };
type SingleResult<T> = { success: boolean; data: T };

export type DegreeItem = {
  id: number;
  name: string;
  slug: string;
};

/** @deprecated use DegreeItem */
export type CarreraItem = DegreeItem;

export type Review = {
  id: string;
  author: string;
  authorSlug: string;
  initials: string;
  degree: string;
  degreeSlug: string | null;
  subject: string;
  department: string;
  departmentSlug: string;
  head: string;
  term: string;
  year: number;
  period: "FIRST" | "SECOND" | "SUMMER";
  rating: number | null;
  workload: number | null;
  difficulty: number | null;
  recommends: boolean;
  body: string;
  likes: number;
  date: string;
  tags: string[];
};

export type DepartmentStats = {
  id: string;
  slug: string;
  name: string;
  head: string;
  subjects: string[];
  degrees: string[];
  reviews: Review[];
  rating: number;
  workload: number;
  difficulty: number;
  recommendPct: number;
  totalLikes: number;
};

/** @deprecated use DepartmentStats */
export type CatedraStats = DepartmentStats;

export type TagItem = {
  id: number;
  name: string;
};

export type CreateReviewBody = {
  departmentId: string;
  subjectId?: string;
  degreeId?: string;
  rating: number;
  workload: number;
  difficulty: number;
  recommends: boolean;
  body: string;
  year: number;
  period: "FIRST" | "SECOND" | "SUMMER";
  tagIds?: number[];
};

export type SubjectItem = {
  id: number;
  name: string;
  slug: string;
  anio: number | null;
  degrees: Array<{ name: string; slug: string }>;
  departments: Array<{ name: string; slug: string }>;
};

/** @deprecated use SubjectItem */
export type MateriaItem = SubjectItem;

export type UserProfile = {
  slug: string;
  name: string;
  initials: string;
  degrees: Array<{ name: string; currentYear: number | null }>;
  bio: string;
  reviews: Review[];
  avgRating: number;
  totalLikes: number;
  recommendPct: number;
};

/** @deprecated use UserProfile */
export type UsuarioPerfil = UserProfile;

export async function getCarreras(): Promise<DegreeItem[]> {
  const result = await apiFetch<ListResult<DegreeItem>>("/v1/carreras");
  return result.data;
}

export async function getReviews(params?: {
  search?: string;
  degreeSlug?: string;
  departmentSlug?: string;
  orderBy?: string;
  order?: "ASC" | "DESC";
}): Promise<Review[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.degreeSlug) qs.set("degreeSlug", params.degreeSlug);
  if (params?.departmentSlug) qs.set("departmentSlug", params.departmentSlug);
  if (params?.orderBy) qs.set("orderBy", params.orderBy);
  if (params?.order) qs.set("order", params.order);
  const result = await apiFetch<ListResult<Review>>(`/v1/reviews?${qs}`);
  return result.data;
}

export async function getCatedras(): Promise<DepartmentStats[]> {
  const result = await apiFetch<ListResult<DepartmentStats>>("/v1/catedras");
  return result.data;
}

export async function getCatedra(slug: string): Promise<DepartmentStats | null> {
  try {
    const result = await apiFetch<SingleResult<DepartmentStats>>(`/v1/catedras/${slug}`);
    return result.data;
  } catch {
    return null;
  }
}

export async function getMaterias(): Promise<SubjectItem[]> {
  const result = await apiFetch<ListResult<SubjectItem>>("/v1/materias");
  return result.data;
}

export async function getUsuarios(): Promise<UserProfile[]> {
  const result = await apiFetch<ListResult<UserProfile>>("/v1/usuarios");
  return result.data;
}

export async function getUsuario(slug: string): Promise<UserProfile | null> {
  try {
    const result = await apiFetch<SingleResult<UserProfile>>(`/v1/usuarios/${slug}`);
    return result.data;
  } catch {
    return null;
  }
}

export async function getTags(): Promise<TagItem[]> {
  try {
    const result = await apiFetch<ListResult<TagItem>>("/v1/tags");
    return result.data;
  } catch {
    return [];
  }
}

export async function createReview(body: CreateReviewBody): Promise<{ success: boolean; data?: Review; error?: string }> {
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const res = await fetch(`${API}/v1/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) return { success: false, error: json?.message ?? "Error al crear la reseña" };
  return { success: true, data: json.data };
}
