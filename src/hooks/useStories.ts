import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storieService } from "@/lib/supabase/services/storie.service";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { Storie } from "@/lib/supabase/models";

export function useStories(boardId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const {
    data: stories = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["stories", boardId],
    enabled: !!user && !!boardId,
    queryFn: async () => storieService.getStoriesByBoardId(supabase!, boardId),
  });

  const createStoryMutation = useMutation({
    mutationFn: async (storyData: {
      board_id: string;
      title: string;
      description: string;
    }) => storieService.createStorie(supabase!, storyData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", boardId],
      });
    },
  });

  return {
    stories,
    isLoading,
    isFetching,
    error,
    createStory: createStoryMutation.mutateAsync,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["stories", boardId] }),
  };
}

export function useStorie(storieId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const {
    data: storie,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["storie", storieId],
    enabled: !!user && !!storieId,
    queryFn: async () => storieService.getStorieById(supabase!, storieId),
  });

  const updateStorieMutation = useMutation({
    mutationFn: async (updates: Partial<Storie>) =>
      storieService.updateStorie(supabase!, storieId, updates),

    onSuccess: (updated) => {
      queryClient.setQueryData(["storie", storieId], updated);

      queryClient.setQueryData<Storie[]>(
        ["stories", updated.board_id],
        (old) =>
          old?.map((s) => (s.id === updated.id ? (updated as Storie) : s)) ??
          old
      );
    },
  });

  const deleteStorieMutation = useMutation({
    mutationFn: async () => storieService.deleteStorie(supabase!, storieId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storie", storieId] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  return {
    storie,
    isLoading,
    isFetching,
    error,

    updateStorie: updateStorieMutation.mutateAsync,
    isUpdating: updateStorieMutation.isPending,
    deleteStorie: deleteStorieMutation.mutateAsync,

    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["storie", storieId] }),
  };
}
