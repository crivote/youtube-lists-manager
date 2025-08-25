// src/services/youtube/YouTubeApiTypes.ts

// Tipo para la información del snippet de una lista de reproducción
export interface PlaylistSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  channelTitle: string;
  localized: {
    title: string;
    description: string;
  };
}

// Tipo para un ítem de lista de reproducción
export interface PlaylistItem {
  kind: string;
  etag: string;
  id: string; // El ID del ítem de la lista (playlistItemId)
  snippet: PlaylistSnippet;
  contentDetails: {
    itemCount: number;
  };
  status: {
    privacyStatus: string;
  };
}

// Tipo para la respuesta completa de la API al obtener listas
export interface PlaylistResponse {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: PlaylistItem[];
}

// Tipo para el recurso de un video en un playlistItem
export interface VideoResource {
  kind: "youtube#video";
  videoId: string;
}

// Tipo para el snippet al añadir un video a una lista
export interface AddVideoSnippet {
  playlistId: string;
  resourceId: VideoResource;
}

// Tipo para la respuesta al añadir un video
export interface AddVideoResponse {
  kind: "youtube#playlistItem";
  etag: string;
  id: string; // El nuevo playlistItemId
  snippet: AddVideoSnippet;
}
