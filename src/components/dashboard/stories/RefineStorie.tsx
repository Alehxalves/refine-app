"use client";

import { useCheckLists } from "@/hooks/useChecklists";
import { useStorie } from "@/hooks/useStories";
import { useComments } from "@/hooks/useComments";
import {
  Box,
  Button,
  Checkbox,
  CheckboxCheckedChangeDetails,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Separator,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { goodStorieTip } from "./tips/storie-tips";
import { investTip } from "./tips/dor-tips";
import { Storie } from "@/lib/supabase/models";

const StorieSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
});

type StorieValues = z.infer<typeof StorieSchema>;

interface RefineStorieProps {
  storieId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RefineStorie({
  storieId,
  isOpen,
  onClose,
}: RefineStorieProps) {
  const { storie, updateStorie } = useStorie(storieId);
  const { checkLists, error, updateCheckItem } = useCheckLists(storieId);

  // 🔹 comentários da storie
  const {
    comments,
    isLoading: isLoadingComments,
    isCreating,
    createComment,
  } = useComments(storieId);

  const [newComment, setNewComment] = useState("");

  const {
    control,
    formState: { errors },
    clearErrors,
    reset,
    trigger,
    getValues,
  } = useForm<StorieValues>({
    resolver: zodResolver(StorieSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (storie && isOpen) {
      reset({
        title: storie.title ?? "",
        description: storie.description ?? "",
      });
    }
  }, [storie, isOpen, reset]);

  const investChecklist = checkLists?.find((cl) => cl.type === "INVEST");

  async function handleBlurField(fieldName: keyof StorieValues) {
    const isValid = await trigger(fieldName);
    if (!isValid || !storie) return;

    const value = getValues(fieldName);
    if (value === (storie as any)[fieldName]) return;

    try {
      await updateStorie({ [fieldName]: value } as Partial<Storie>);
    } catch (err) {
      console.error("Erro ao atualizar história:", err);
    }
  }

  async function handleAddComment() {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      await createComment({
        story_id: storieId,
        context: "INVEST",
        message: trimmed,
      });
      setNewComment("");
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
    }
  }

  return (
    <Dialog.Root
      size="lg"
      open={isOpen === true}
      onOpenChange={(details) => {
        if (!details.open) {
          clearErrors();
          onClose();
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header flexDir="column">
              <Dialog.Title fontSize={{ base: "sm", sm: "md", lg: "md" }}>
                Refinar História de Usuário com INVEST
              </Dialog.Title>
              {error && (
                <Text fontSize="xs" color="red.500" mt="1">
                  {error}
                </Text>
              )}
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap="4" align="flex-start" flexDir="row" flexWrap="wrap">
                {/* TÍTULO */}
                <Field.Root invalid={!!errors.title} width="100%">
                  <Field.Label
                    fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                    fontWeight="bold"
                  >
                    Título
                  </Field.Label>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <Input
                        borderColor={{ base: "gray.200", _dark: "gray.500" }}
                        placeholder="Ex: US.1 - Registrar notas dos alunos"
                        {...field}
                        onBlur={async () => {
                          field.onBlur();
                          await handleBlurField("title");
                        }}
                      />
                    )}
                  />
                  <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                </Field.Root>

                {/* DESCRIÇÃO */}
                <Field.Root invalid={!!errors.description} width="100%">
                  <Field.Label
                    fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                    fontWeight="bold"
                  >
                    Descrição
                  </Field.Label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                        borderColor={{ base: "gray.200", _dark: "gray.500" }}
                        placeholder="Como [persona], eu quero [algo] para [benefício/resultado]."
                        minH="120px"
                        {...field}
                        onBlur={async () => {
                          field.onBlur();
                          await handleBlurField("description");
                        }}
                      />
                    )}
                  />
                  <Field.ErrorText>
                    {errors.description?.message}
                  </Field.ErrorText>
                </Field.Root>

                {goodStorieTip()}

                <Separator w="100%" />

                {/* CHECKLIST INVEST */}
                {investChecklist && (
                  <Box width="100%">
                    <Text
                      fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                      fontWeight="bold"
                      mb="2"
                      _dark={{ color: "gray.200" }}
                    >
                      {investChecklist.title}
                    </Text>
                    <Stack gap="2">
                      {investChecklist.items.map((item) => (
                        <Checkbox.Root
                          key={item.id}
                          checked={item.is_checked}
                          onCheckedChange={(
                            details: CheckboxCheckedChangeDetails
                          ) => {
                            updateCheckItem(item.id, details.checked === true);
                          }}
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Label
                            fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                          >
                            {item.title}
                          </Checkbox.Label>
                        </Checkbox.Root>
                      ))}
                    </Stack>
                  </Box>
                )}

                {investTip()}

                {/* 🔽 SEÇÃO DE COMENTÁRIOS */}
                <Box w="100%" mt="4">
                  <Text
                    fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                    fontWeight="bold"
                    mb="2"
                  >
                    Comentários sobre o refinamento
                  </Text>

                  {/* Criar comentário */}
                  <Stack gap="2" mb="3">
                    <Textarea
                      fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
                      borderColor={{ base: "gray.200", _dark: "gray.500" }}
                      placeholder="Registre dúvidas, sugestões ou decisões sobre essa história..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      minH="80px"
                    />
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        size="xs"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        loading={isCreating}
                      >
                        Adicionar comentário
                      </Button>
                    </Box>
                  </Stack>

                  {/* Lista de comentários */}
                  <Stack
                    gap="2"
                    maxH="200px"
                    overflowY="auto"
                    borderTopWidth="1px"
                    borderColor={{ base: "gray.200", _dark: "gray.700" }}
                    pt="2"
                  >
                    {isLoadingComments ? (
                      <Text fontSize="xs" color="gray.500">
                        Carregando comentários...
                      </Text>
                    ) : comments.length === 0 ? (
                      <Text fontSize="xs" color="gray.500">
                        Nenhum comentário ainda. Comece registrando as decisões
                        que você está tomando ao refinar essa história.
                      </Text>
                    ) : (
                      comments.map((comment) => (
                        <Box
                          key={comment.id}
                          p="2"
                          borderRadius="md"
                          bg={{ base: "gray.50", _dark: "gray.900" }}
                          borderWidth="1px"
                          borderColor={{
                            base: "gray.200",
                            _dark: "gray.700",
                          }}
                        >
                          <Text fontSize="xs" color="gray.500" mb="1">
                            {comment.context || "Comentário"} •{" "}
                            {new Date(comment.created_at).toLocaleString()}
                          </Text>
                          <Text fontSize="sm">{comment.message}</Text>
                        </Box>
                      ))
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
