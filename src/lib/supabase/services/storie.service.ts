import { SupabaseClient } from "@supabase/supabase-js";
import { Storie } from "../models";

export const storieService = {
  async createStorie(
    supabase: SupabaseClient,
    storie: Omit<
      Storie,
      "id" | "created_at" | "updated_at" | "default_priority" | "sort_order"
    >
  ): Promise<Storie> {
    const { data: createdStory, error } = await supabase
      .from("stories")
      .insert(storie)
      .select()
      .single();

    if (error) throw error;

    const { data: checklist, error: checklistError } = await supabase
      .from("check_lists")
      .insert({
        storie_id: createdStory.id,
        type: "INVEST",
        title: "Checklist INVEST",
      })
      .select()
      .single();

    if (checklistError) throw checklistError;

    const investItems = [
      { title: "Independente" },
      { title: "Negociável" },
      { title: "Valiosa" },
      { title: "Estimável" },
      { title: "Pequena" },
      { title: "Testável" },
    ];

    const { error: itemsError } = await supabase
      .from("check_list_items")
      .insert(
        investItems.map((item, index) => ({
          check_list_id: checklist.id,
          title: item.title,
          is_checked: false,
          sort_order: index,
        }))
      );

    if (itemsError) throw itemsError;

    return createdStory;
  },
  async updateStorie(
    supabase: SupabaseClient,
    storieId: string,
    updates: Partial<Storie>
  ): Promise<Storie> {
    const { data, error } = await supabase
      .from("stories")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", storieId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteStorie(
    supabase: SupabaseClient,
    storieId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", storieId);

    if (error) throw error;
  },

  async getStorieById(
    supabase: SupabaseClient,
    storieId: string
  ): Promise<Storie> {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", storieId)
      .single();

    if (error) throw error;
    return data || {};
  },

  async getStoriesByBoardId(
    supabase: SupabaseClient,
    boardId: string
  ): Promise<Storie[]> {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
