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

export type CarreraItem = {
  id: number;
  nombre: string;
  slug: string;
};

export type Review = {
  id: string;
  autor: string;
  autorSlug: string;
  iniciales: string;
  carrera: string;
  materia: string;
  catedra: string;
  catedraSlug: string;
  titular: string;
  cuatrimestre: string;
  anioCursado: number;
  periodo: "PRIMERO" | "SEGUNDO" | "VERANO";
  rating: number;
  cargaHoraria: number;
  dificultad: number;
  recomienda: boolean;
  texto: string;
  likes: number;
  fecha: string;
  tags: string[];
};

export type CatedraStats = {
  slug: string;
  catedra: string;
  titular: string;
  materias: string[];
  carreras: string[];
  reviews: Review[];
  rating: number;
  cargaHoraria: number;
  dificultad: number;
  recomiendaPct: number;
  totalLikes: number;
};

export type MateriaItem = {
  id: number;
  nombre: string;
  slug: string;
  anio: number | null;
  carreras: Array<{ nombre: string; slug: string }>;
  catedras: Array<{ nombre: string; slug: string }>;
};

export type UsuarioPerfil = {
  slug: string;
  nombre: string;
  iniciales: string;
  carreras: Array<{ nombre: string; cursandoAnio: number | null }>;
  bio: string;
  reviews: Review[];
  promedioPuntaje: number;
  totalLikes: number;
  recomiendaPct: number;
};

export async function getCarreras(): Promise<CarreraItem[]> {
  const result = await apiFetch<ListResult<CarreraItem>>("/v1/carreras");
  return result.data;
}

export async function getReviews(params?: {
  search?: string;
  carreraSlug?: string;
  catedraSlug?: string;
  orderBy?: string;
  order?: "ASC" | "DESC";
}): Promise<Review[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.carreraSlug) qs.set("carreraSlug", params.carreraSlug);
  if (params?.catedraSlug) qs.set("catedraSlug", params.catedraSlug);
  if (params?.orderBy) qs.set("orderBy", params.orderBy);
  if (params?.order) qs.set("order", params.order);
  const result = await apiFetch<ListResult<Review>>(`/v1/reviews?${qs}`);
  return result.data;
}

export async function getCatedras(): Promise<CatedraStats[]> {
  const result = await apiFetch<ListResult<CatedraStats>>("/v1/catedras");
  return result.data;
}

export async function getCatedra(slug: string): Promise<CatedraStats | null> {
  try {
    const result = await apiFetch<SingleResult<CatedraStats>>(`/v1/catedras/${slug}`);
    return result.data;
  } catch {
    return null;
  }
}

export async function getMaterias(): Promise<MateriaItem[]> {
  const result = await apiFetch<ListResult<MateriaItem>>("/v1/materias");
  return result.data;
}

export async function getUsuarios(): Promise<UsuarioPerfil[]> {
  const result = await apiFetch<ListResult<UsuarioPerfil>>("/v1/usuarios");
  return result.data;
}

export async function getUsuario(slug: string): Promise<UsuarioPerfil | null> {
  try {
    const result = await apiFetch<SingleResult<UsuarioPerfil>>(`/v1/usuarios/${slug}`);
    return result.data;
  } catch {
    return null;
  }
}
