import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DayProgress, Reflection } from "@/types";

export async function getUserProgress(bookSlug: string) {
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      dayProgress: [] as DayProgress[],
      reflections: [] as Reflection[],
      enrollment: null,
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return {
      user: null,
      dayProgress: [] as DayProgress[],
      reflections: [] as Reflection[],
      enrollment: null,
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      dayProgress: [] as DayProgress[],
      reflections: [] as Reflection[],
      enrollment: null,
    };
  }

  const [progressRes, reflectionsRes, enrollmentRes] = await Promise.all([
    supabase
      .from("day_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_slug", bookSlug),
    supabase
      .from("reflections")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_slug", bookSlug),
    supabase
      .from("user_book_enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("book_slug", bookSlug)
      .maybeSingle(),
  ]);

  return {
    user,
    dayProgress: (progressRes.data || []) as DayProgress[],
    reflections: (reflectionsRes.data || []) as Reflection[],
    enrollment: enrollmentRes.data,
  };
}

export async function getDayUserData(bookSlug: string, dayNumber: number) {
  const { user, dayProgress, reflections } = await getUserProgress(bookSlug);

  const dayData = dayProgress.find((d) => d.day_number === dayNumber);
  const reflection = reflections.find((r) => r.day_number === dayNumber);

  return {
    user,
    checklist: (dayData?.checklist_state || {}) as Record<string, boolean>,
    completed: dayData?.completed || false,
    reflection: reflection?.content || "",
  };
}
