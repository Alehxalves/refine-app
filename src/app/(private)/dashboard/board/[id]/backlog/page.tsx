"use client";

import CreateStorie from "@/components/dashboard/stories/CreateStorie";
import RefineStorie from "@/components/dashboard/stories/RefineStorie";
import { useStorie, useStories } from "@/hooks/useStories";
import { Storie } from "@/lib/supabase/models";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Progress,
  Separator,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Check, Flag, Gavel, Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCheckLists } from "@/hooks/useChecklists";

interface StorieProps {
  storie: Storie;
  children?: React.ReactNode;
  onEdit?: (storie: Storie) => void;
  onRefine?: (storie: Storie) => void;
  shouldRefetch?: (value: boolean) => void;
}

function StorieList({ storie, shouldRefetch }: StorieProps) {
  const { deleteStorie } = useStorie(storie.id);
  const { checkLists } = useCheckLists(storie.id);

  const {
    open: isOpenRefine,
    onOpen: onOpenRefine,
    onClose: onCloseRefine,
  } = useDisclosure();
  const [isHammering, setIsHammering] = useState(false);

  const [isRefined, setIsRefined] = useState(false);

  function triggerHammer() {
    setIsHammering(true);
    setTimeout(() => setIsHammering(false), 350);
  }

  return (
    <GridItem>
      <Card.Root bg={{ base: "gray.50", _dark: "gray.900" }} size="sm">
        <Card.Body gap="2">
          <HStack alignItems="center" justify="space-between" mb="2">
            <Card.Title fontSize={{ base: "sm", sm: "md", lg: "md" }}>
              <VStack align="flex-start" gap="2">
                {isRefined && (
                  <Badge colorPalette="green" variant="solid">
                    <Check size="13" />
                    Refinado
                  </Badge>
                )}
                {storie.title}
              </VStack>
            </Card.Title>
            <HStack gap="1">
              <IconButton
                size="xs"
                variant="ghost"
                title="Deletar"
                onClick={async (e) => {
                  e.stopPropagation();

                  try {
                    if (storie.id) {
                      await deleteStorie();
                      shouldRefetch?.(true);
                    }
                  } catch (error) {
                    console.error("Erro ao deletar storie:", error);
                  }
                }}
                bg="gray.900"
                borderRadius="3xl"
              >
                <Trash size="18" color="white" />
              </IconButton>
            </HStack>
          </HStack>
          <Card.Description fontSize={{ base: "xs", sm: "sm", lg: "sm" }}>
            {storie.description}
          </Card.Description>
        </Card.Body>
        <Separator pt="2" pb="2" />
        <Card.Footer justifyContent="space-between">
          <VStack minW="240px" alignItems="flex-start">
            {checkLists?.map((cl) => {
              const totalItems = cl.items.length;
              const completedItems = cl.items.filter(
                (item) => item.is_checked
              ).length;
              const progress =
                totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

              if (progress === 100) {
                if (!isRefined) {
                  setIsRefined(true);
                }
              } else {
                if (isRefined) {
                  setIsRefined(false);
                }
              }

              return (
                <Progress.Root key={cl.id} value={progress}>
                  <Progress.Label mb="2">{cl.title}</Progress.Label>
                  <HStack gap="5">
                    <Progress.Track flex="1" minW="150px" maxW="150px">
                      <Progress.Range colorPalette="green" />
                    </Progress.Track>
                    <Progress.ValueText>
                      {Math.round(progress)}%
                    </Progress.ValueText>
                  </HStack>
                </Progress.Root>
              );
            })}
          </VStack>

          <HStack gap="2">
            <Button
              variant="outline"
              size="xs"
              borderRadius="3xl"
              onClick={(e) => {
                e.stopPropagation();
                triggerHammer();
                onOpenRefine();
              }}
            >
              <motion.span
                animate={isHammering ? "hit" : "initial"}
                variants={{
                  initial: { rotate: -45 },
                  hit: {
                    rotate: [35, 0, 35],
                    transition: { duration: 0.3, ease: "easeInOut" },
                  },
                }}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <Gavel size={14} />
              </motion.span>
              Refinar
            </Button>

            <Button
              size="xs"
              borderRadius="3xl"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Flag size={14} /> Priorizar
            </Button>
          </HStack>
        </Card.Footer>
      </Card.Root>

      <RefineStorie
        storieId={storie.id}
        isOpen={isOpenRefine}
        onClose={onCloseRefine}
      />
    </GridItem>
  );
}

export default function BacklogPage() {
  const params = useParams();
  const boardId = params.id as string;
  const { stories, isLoading, isFetching, error, refetch } =
    useStories(boardId);

  const [isCreatingStorie, setIsCreatingStorie] = useState(false);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar histórias.</div>;

  const totalStories = stories.length ?? 0;

  return (
    <Container pt="4" spaceY="10">
      <Box spaceY="10">
        <Box mb="2">
          <Text
            fontSize={{ base: "md", sm: "lg", lg: "2xl" }}
            fontWeight="bold"
            fontFamily="monospace"
          >
            Backlog de histórias
          </Text>
          <Text
            fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
            maxW="700"
            mt="1"
          >
            Aqui você visualiza todas as histórias deste quadro. Use esta página
            para <b>capturar, refinar e preparar histórias de usuário</b> antes
            da priorização. Você pode refinar usando o modelo <b>INVEST</b> e
            depois priorizar com técnicas como <b>MoSCoW</b>, <b>CSD</b> ou
            <b> GUT</b>.
          </Text>
        </Box>
        <Stack w="100%" gap="2">
          <HStack justify="space-between" align="center">
            <Text
              fontSize={{ base: "xs", sm: "sm", lg: "sm" }}
              fontWeight="medium"
            >
              Total de histórias: {totalStories}
            </Text>
            <HStack>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? "Atualizando..." : "Recarregar"}
              </Button>
              <Button size="xs" onClick={() => setIsCreatingStorie(true)}>
                <Plus size="18" />
                Adicionar história
              </Button>
            </HStack>
          </HStack>
          {totalStories > 0 && (
            <Text fontSize="xs" color={{ base: "gray.600", _dark: "gray.400" }}>
              Dica: comece refinando as histórias mais importantes antes de
              priorizá-las.
            </Text>
          )}
        </Stack>
      </Box>
      <Separator w="100%" borderColor="gray.200" />
      {isFetching ? (
        <Text fontSize="md">Carregando histórias...</Text>
      ) : totalStories === 0 ? (
        <Box
          w="100%"
          borderWidth="1px"
          borderStyle="dashed"
          borderRadius="lg"
          p="6"
          textAlign="center"
          bg={{ base: "gray.50", _dark: "gray.900" }}
        >
          <Text fontWeight="medium" mb="2">
            Nenhuma história cadastrada ainda.
          </Text>
          <Text fontSize="md" color="gray.500" mb="4">
            Comece criando a primeira história de usuário do seu backlog. Depois
            você poderá refiná-la e aplicar critérios de priorização.
          </Text>
          <Button size="sm" onClick={() => setIsCreatingStorie(true)}>
            <Plus size="18" />
            Criar primeira história
          </Button>
        </Box>
      ) : (
        <Grid gap="4">
          {stories.map((storie) => (
            <StorieList
              key={storie.id}
              storie={storie}
              shouldRefetch={() => refetch()}
            />
          ))}
        </Grid>
      )}

      <CreateStorie
        isOpen={isCreatingStorie}
        onClose={() => setIsCreatingStorie(false)}
      />
    </Container>
  );
}
