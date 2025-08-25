// src/services/youtube/YouTubeApiService.ts
import { googleAuthService } from "../google-oauth/facade";
import {
  PlaylistResponse,
  PlaylistItem,
  AddVideoResponse,
} from "../../model/youTubeTypes";

/**
 * Servicio de fachada para la API de YouTube.
 */
class YouTubeApiService {
  private async withTokenRefresh<T>(
    apiCall: (accessToken: string) => Promise<T>
  ): Promise<T | { error: string }> {
    const accessToken = localStorage.getItem("google_access_token");
    if (!accessToken) {
      return { error: "No hay token de acceso disponible." };
    }

    try {
      return await apiCall(accessToken);
    } catch (error: any) {
      if (error.status === 401) {
        // Token expirado
        const newTokens = await googleAuthService.refreshAccessToken();
        if (newTokens) {
          return this.withTokenRefresh(apiCall);
        }
        return { error: "Sesión expirada. Por favor, inicia sesión de nuevo." };
      }
      return { error: "Error en la llamada a la API." };
    }
  }

  /**
   * Carga las listas de reproducción del usuario.
   */
  public async getPlaylists(): Promise<PlaylistItem[] | { error: string }> {
    const result = await this.withTokenRefresh<PlaylistResponse>(
      async (accessToken) => {
        const endpoint =
          "https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true";
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          throw response;
        }
        return await response.json();
      }
    );

    if ("error" in result) {
      return result;
    }
    return result.items;
  }

  /**
   * Añade un video a una lista de reproducción.
   * @param playlistId El ID de la lista a la que se va a añadir el video.
   * @param videoId El ID del video que se va a añadir.
   */
  public async addVideoToPlaylist(
    playlistId: string,
    videoId: string
  ): Promise<AddVideoResponse | { error: string }> {
    return this.withTokenRefresh<AddVideoResponse>(async (accessToken) => {
      const endpoint =
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: videoId,
            },
          },
        }),
      });
      if (!response.ok) {
        throw response;
      }
      return await response.json();
    });
  }

  /**
   * Elimina un video de una lista de reproducción.
   * @param playlistItemId El ID del ítem de la lista.
   */
  public async removeVideoFromPlaylist(
    playlistItemId: string
  ): Promise<{ success: boolean } | { error: string }> {
    return this.withTokenRefresh<{ success: boolean }>(async (accessToken) => {
      const endpoint = `https://www.googleapis.com/youtube/v3/playlistItems?id=${playlistItemId}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw response;
      }
      return { success: response.status === 204 };
    });
  }
}

export const youtubeApiService = new YouTubeApiService();
