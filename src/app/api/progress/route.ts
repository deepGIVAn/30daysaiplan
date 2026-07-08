import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookSlug, dayNumber, checklist, reflection, completed } = body;

    if (!bookSlug || !dayNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true, local: true });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ success: true, local: true });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await supabase.from("user_book_enrollments").upsert(
      {
        user_id: user.id,
        book_slug: bookSlug,
        current_day: dayNumber,
      },
      { onConflict: "user_id,book_slug" },
    );

    await supabase.from("day_progress").upsert(
      {
        user_id: user.id,
        book_slug: bookSlug,
        day_number: dayNumber,
        checklist_state: checklist || {},
        completed: completed || false,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,book_slug,day_number" },
    );

    if (reflection !== undefined) {
      await supabase.from("reflections").upsert(
        {
          user_id: user.id,
          book_slug: bookSlug,
          day_number: dayNumber,
          content: reflection,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book_slug,day_number" },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookSlug = searchParams.get("bookSlug");

  if (!bookSlug) {
    return NextResponse.json({ error: "bookSlug required" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ dayProgress: [], reflections: [], enrollment: null });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ dayProgress: [], reflections: [], enrollment: null });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ dayProgress: [], reflections: [], enrollment: null });
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
      .single(),
  ]);

  return NextResponse.json({
    dayProgress: progressRes.data || [],
    reflections: reflectionsRes.data || [],
    enrollment: enrollmentRes.data,
  });
}
