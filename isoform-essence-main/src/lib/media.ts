import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "project-media";

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();

function isAbsolute(value: string) {
  return /^(https?:)?\/\//.test(value) || value.startsWith("data:") || value.startsWith("/");
}

/** Resolve a stored media reference (storage path or absolute URL) to a usable URL. */
export async function resolveMedia(ref: string | null | undefined): Promise<string | null> {
  if (!ref) return null;
  if (isAbsolute(ref)) return ref;
  const cached = cache.get(ref);
  if (cached) return cached;

  let pending = inflight.get(ref);
  if (!pending) {
    pending = supabase.storage
      .from(MEDIA_BUCKET)
      .createSignedUrl(ref, 60 * 60 * 24 * 7)
      .then(({ data }) => {
        const url = data?.signedUrl ?? null;
        if (url) cache.set(ref, url);
        return url;
      })
      .finally(() => inflight.delete(ref));
    inflight.set(ref, pending);
  }
  return pending;
}

export function useMediaUrl(ref: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(() =>
    ref && isAbsolute(ref) ? ref : ref ? (cache.get(ref) ?? null) : null,
  );

  useEffect(() => {
    let active = true;
    if (!ref) {
      setUrl(null);
      return;
    }
    resolveMedia(ref).then((value) => {
      if (active) setUrl(value);
    });
    return () => {
      active = false;
    };
  }, [ref]);

  return url;
}

export async function uploadMedia(file: File, slug: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${slug || "unsorted"}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function removeMedia(path: string) {
  if (isAbsolute(path)) return;
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
