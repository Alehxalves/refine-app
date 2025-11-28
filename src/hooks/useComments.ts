"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/lib/supabase/services/comments.service";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";

export function useComments(storieId: string) {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["comments", storieId],
    enabled: !!user && !!storieId,
    queryFn: async () =>
      commentService.getCommentsByStorieId(supabase!, storieId),
  });

  const createCommentMutation = useMutation({
    mutationFn: async (commentData: {
      story_id: string;
      context: string;
      message: string;
    }) => commentService.createComment(supabase!, commentData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", storieId],
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) =>
      commentService.deleteComment(supabase!, commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", storieId],
      });
    },
  });

  return {
    comments,
    isLoading,
    isFetching,
    error,

    createComment: createCommentMutation.mutateAsync,
    isCreating: createCommentMutation.isPending,

    deleteComment: deleteCommentMutation.mutateAsync,
    isDeleting: deleteCommentMutation.isPending,

    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", storieId] }),
  };
}
