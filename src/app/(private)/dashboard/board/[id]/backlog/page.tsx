"use client";

import CreateStory from "@/components/dashboard/stories/CreateStory";
import RefineStory from "@/components/dashboard/stories/RefineStory";
import { useStories } from "@/hooks/useStories";
import { Story, StoryGroup } from "@/lib/supabase/models";
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
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { Check, Flag, Gavel, Plus, RefreshCcw } from "lucide-react";
import { useParams } from "next/navigation";
import React, { DragEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useCheckLists } from "@/hooks/useChecklists";
import StorySettings from "@/components/dashboard/stories/StorySettings";
import { PrioritizeStory } from "@/components/dashboard/stories/PrioritizeStory";
import CreateStoryGroup from "@/components/dashboard/stories/story-group/CreateStoryGroup";
import { useStoryGroups } from "@/hooks/useStoryGroups";
import StoryGroupSettings from "@/components/dashboard/stories/story-group/StoryGroupSettings";
import UpdateStoryGroup from "@/components/dashboard/stories/story-group/UpdateStoryGroup";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loading1.json";

interface StoryProps {
  story: Story;
  isMobile?: boolean;
  onEdit?: (story: Story) => void;
  onRefine?: (story: Story) => void;
  shouldRefetch?: (value: boolean) => void;
}

function StoryList({ story, isMobile, shouldRefetch }: StoryProps) {
  const { checkLists } = useCheckLists(story.id);

  const {
    open: isOpenRefine,
    onOpen: onOpenRefine,
    onClose: onCloseRefine,
  } = useDisclosure();
  const {
    open: isOpenPriority,
    onOpen: onOpenPriority,
    onClose: onClosePriority,
  } = useDisclosure();

  const [isHammering, setIsHammering] = useState(false);
  const [isRefined, setIsRefined] = useState(false);

  function triggerHammer() {
    setIsHammering(true);
    setTimeout(() => setIsHammering(false), 350);
  }

  return (
    <GridItem
      draggable
      onDragStart={(e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text/plain", story.id);
      }}
    >
      <Card.Root
        size="sm"
        bg={{ base: "white", _dark: "gray.900" }}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={{ base: "gray.200", _dark: "gray.800" }}
        _hover={{
          borderColor: {
            base: "gray.300",
            _dark: "gray.600",
          },
          transform: "translateY(-1px)",
        }}
        transition="all 0.15s ease-out"
      >
        <Card.Body gap="3">
          <HStack alignItems="flex-start" justify="space-between">
            <VStack align="flex-start" gap="1">
              {isRefined && (
                <Badge colorPalette="green" variant="subtle" py="0.5">
                  <Check size={12} />
                  Refinado
                </Badge>
              )}
              <Card.Title fontSize={{ base: "sm", sm: "md" }}>
                {story.title}
              </Card.Title>
              <Card.Description fontSize={{ base: "xs", sm: "sm" }}>
                {story.description}
              </Card.Description>
            </VStack>

            <StorySettings storyId={story.id} shouldRefetch={shouldRefetch} />
          </HStack>
        </Card.Body>

        <Separator />
        <Card.Footer justifyContent="flex-end" gap="2" py="2.5">
          {checkLists && checkLists.length > 0 && (
            <VStack align="flex-start" gap="3" w="100%">
              {checkLists.map((cl) => {
                const totalItems = cl.items.length;
                const completedItems = cl.items.filter(
                  (item) => item.is_checked
                ).length;
                const progress =
                  totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

                if (progress === 100) {
                  if (!isRefined) setIsRefined(true);
                } else if (isRefined) {
                  setIsRefined(false);
                }

                return (
                  <Box key={cl.id}>
                    <Text fontSize="xs" fontWeight="medium">
                      {cl.title}
                    </Text>
                    <HStack gap="4">
                      <Progress.Root value={progress}>
                        <Progress.Track flex="1" minW="150px" maxW="150px">
                          <Progress.Range colorPalette="green" />
                        </Progress.Track>
                      </Progress.Root>
                      <Text fontSize="xs" color="gray.500">
                        {Math.round(progress)}%
                      </Text>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          )}
          <HStack mt="2">
            <Button
              title="Refinar"
              variant="ghost"
              size="xs"
              borderRadius="full"
              px="3"
              onClick={(e) => {
                e.stopPropagation();
                triggerHammer();
                onOpenRefine();
              }}
              _hover={{
                borderColor: {
                  base: "gray.300",
                  _dark: "gray.600",
                },
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
              {!isMobile && "Refinar"}
            </Button>
            <Button
              title="Priorizar"
              size="xs"
              borderRadius="full"
              px="3"
              onClick={(e) => {
                e.stopPropagation();
                onOpenPriority();
              }}
              _hover={{
                borderColor: {
                  base: "gray.300",
                  _dark: "gray.600",
                },
              }}
            >
              <Flag size={14} />
              {!isMobile && "Priorizar"}
            </Button>
          </HStack>
        </Card.Footer>
      </Card.Root>
      <RefineStory
        storyId={story.id}
        isOpen={isOpenRefine}
        onClose={onCloseRefine}
      />
      <PrioritizeStory
        storyId={story.id}
        isOpen={isOpenPriority}
        onClose={onClosePriority}
      />
    </GridItem>
  );
}

export default function BacklogPage() {
  const [isMobile] = useMediaQuery(["(max-width: 400px)"]);
  const params = useParams();
  const boardId = params.id as string;

  const { stories, isLoading, isFetching, error, refetch, moveStoryToGroup } =
    useStories(boardId);
  const {
    storyGroups,
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
    deleteStoryGroup,
    updateStoryGroup,
    refetch: refetchGroups,
  } = useStoryGroups(boardId);

  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [creatingStoryGroupId, setCreatingStoryGroupId] = useState<
    string | null
  >(null);

  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StoryGroup | null>(null);
  const [isEditingGroupOpen, setIsEditingGroupOpen] = useState(false);

  const totalStories = stories.length ?? 0;

  const storiesWithoutGroup = useMemo(
    () => stories.filter((s) => !s.story_group_id),
    [stories]
  );

  function storiesByGroupId(groupId: string) {
    return stories.filter((s) => s.story_group_id === groupId);
  }

  async function handleDropOnGroup(
    e: DragEvent<HTMLDivElement>,
    groupId: string | null
  ) {
    e.preventDefault();
    const storyId = e.dataTransfer.getData("text/plain");
    if (!storyId) return;

    try {
      await moveStoryToGroup(storyId, groupId);
    } catch (err) {
      console.error("Erro ao mover história para grupo:", err);
    }
  }

  async function handleMoveGroupUp(groupId: string) {
    const index = storyGroups.findIndex((g) => g.id === groupId);
    if (index <= 0) return;

    const current = storyGroups[index];
    const previous = storyGroups[index - 1];

    try {
      await Promise.all([
        updateStoryGroup({
          groupId: current.id,
          updates: { sort_order: previous.sort_order },
        }),
        updateStoryGroup({
          groupId: previous.id,
          updates: { sort_order: current.sort_order },
        }),
      ]);
    } catch (error) {
      console.error(`Erro ao mover grupo ${groupId} para cima:`, error);
    }
  }

  async function handleMoveGroupDown(groupId: string) {
    const index = storyGroups.findIndex((g) => g.id === groupId);
    if (index === -1 || index === storyGroups.length - 1) return;

    const current = storyGroups[index];
    const next = storyGroups[index + 1];

    try {
      await Promise.all([
        updateStoryGroup({
          groupId: current.id,
          updates: { sort_order: next.sort_order },
        }),
        updateStoryGroup({
          groupId: next.id,
          updates: { sort_order: current.sort_order },
        }),
      ]);
    } catch (error) {
      console.error(`Erro ao mover grupo ${groupId} para baixo:`, error);
    }
  }

  const isInitialLoading =
    (isLoading || isLoadingGroups) &&
    stories.length === 0 &&
    storyGroups.length === 0;

  const isRefreshing = isFetching || isFetchingGroups;

  return (
    <Container pt="6" pb="10" maxW="7xl">
      <Box spaceY="8">
        {isInitialLoading ? (
          <VStack mt="16" gap="3">
            <Box mt="10" width={32} mx="auto">
              <Lottie animationData={loadingAnimation} loop />
            </Box>
            <Text fontSize="sm" color="gray.500">
              Carregando backlog...
            </Text>
          </VStack>
        ) : error ? (
          <VStack mt="16" gap="3">
            <Text fontWeight="medium">Erro ao carregar backlog.</Text>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                refetch();
                refetchGroups();
              }}
            >
              <RefreshCcw size={16} />
              Tentar novamente
            </Button>
          </VStack>
        ) : (
          <>
            <HStack justify="space-between" align="flex-start">
              <Box>
                <Text
                  fontSize={{ base: "lg", sm: "xl", lg: "2xl" }}
                  fontWeight="semibold"
                  letterSpacing="-0.02em"
                >
                  Backlog de histórias
                </Text>
                <Text
                  fontSize={{ base: "xs", sm: "sm" }}
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  maxW="680px"
                  mt="1"
                >
                  Organize seu backlog em grupos, refine com INVEST e priorize
                  com MoSCoW, CSD ou GUT antes de levar as histórias para a
                  sprint.
                </Text>
              </Box>

              <HStack gap="2">
                {isRefreshing && (
                  <Spinner
                    size="xs"
                    color={{ base: "gray.500", _dark: "gray.400" }}
                  />
                )}

                <IconButton
                  aria-label="Recarregar"
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    refetch();
                    refetchGroups();
                  }}
                  disabled={isRefreshing}
                >
                  <RefreshCcw size={16} />
                </IconButton>

                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setIsCreatingGroup(true)}
                >
                  <Plus size={14} />
                  Grupo
                </Button>
                <Button
                  size="xs"
                  onClick={() => {
                    setCreatingStoryGroupId(null);
                    setIsCreatingStory(true);
                  }}
                >
                  <Plus size={14} />
                  História
                </Button>
              </HStack>
            </HStack>

            <VStack
              align="flex-start"
              bg={{ base: "gray.50", _dark: "gray.900" }}
              borderRadius="md"
              borderWidth="1px"
              borderColor={{ base: "gray.100", _dark: "gray.800" }}
              px="3"
              py="2.5"
            >
              <Text
                fontSize="xs"
                color={{ base: "gray.700", _dark: "gray.300" }}
              >
                Total de histórias:{" "}
                <Text as="span" fontWeight="semibold">
                  {totalStories}
                </Text>
              </Text>
              {!isMobile && totalStories > 0 && (
                <Text
                  fontSize="xs"
                  color={{ base: "gray.500", _dark: "gray.400" }}
                >
                  Dica: use grupos para representar áreas do produto e arraste
                  histórias entre eles conforme o escopo evoluir.
                </Text>
              )}
            </VStack>
            {totalStories === 0 && storyGroups.length === 0 ? (
              <Card.Root
                mt="4"
                borderRadius="lg"
                bg={{ base: "gray.50", _dark: "gray.900" }}
                borderWidth="1px"
                borderColor={{ base: "gray.100", _dark: "gray.800" }}
              >
                <Card.Body textAlign="center" py="10" gap="3">
                  <Text fontWeight="medium">Nenhuma história cadastrada.</Text>
                  <Text fontSize="sm" color="gray.500">
                    Comece criando um grupo para organizar seu backlog ou
                    adicione a primeira história.
                  </Text>
                  <HStack justify="center" mt="3" gap="3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsCreatingGroup(true)}
                    >
                      <Plus size={16} />
                      Criar grupo
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setCreatingStoryGroupId(null);
                        setIsCreatingStory(true);
                      }}
                    >
                      <Plus size={16} />
                      Criar primeira história
                    </Button>
                  </HStack>
                </Card.Body>
              </Card.Root>
            ) : (
              <Stack gap="6" mt="2">
                {storyGroups.map((group) => {
                  const groupStories = storiesByGroupId(group.id);

                  return (
                    <Card.Root
                      key={group.id}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={{ base: "gray.200", _dark: "gray.800" }}
                      bg={{ base: "white", _dark: "gray.900" }}
                    >
                      <Card.Header
                        py="2.5"
                        px="3"
                        borderBottomWidth="1px"
                        borderColor={{ base: "gray.100", _dark: "gray.800" }}
                      >
                        <HStack justify="space-between" w="100%">
                          <HStack gap="2" justify="center">
                            <Box
                              w="10px"
                              h="10px"
                              borderRadius="full"
                              bg={group.color || "purple.500"}
                            />
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color={{
                                base: "gray.800",
                                _dark: "gray.100",
                              }}
                            >
                              {group.title}
                            </Text>
                            <Text
                              fontSize="sm"
                              color={{ base: "gray.500", _dark: "gray.500" }}
                            >
                              {groupStories.length} histórias
                            </Text>
                            <StoryGroupSettings
                              storyGroupId={group.id}
                              onEdit={() => {
                                setEditingGroup(group);
                                setIsEditingGroupOpen(true);
                              }}
                              onDelete={async () => {
                                await deleteStoryGroup(group.id);
                                await refetchGroups();
                                await refetch();
                              }}
                              onMoveUp={() => handleMoveGroupUp(group.id)}
                              onMoveDown={() => handleMoveGroupDown(group.id)}
                            />
                          </HStack>
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => {
                              setCreatingStoryGroupId(group.id);
                              setIsCreatingStory(true);
                            }}
                          >
                            <Plus size={14} />
                            História
                          </Button>
                        </HStack>
                      </Card.Header>
                      <Card.Body
                        px="3"
                        py="3"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnGroup(e, group.id)}
                      >
                        {groupStories.length === 0 ? (
                          <Text
                            fontSize="xs"
                            color={{ base: "gray.500", _dark: "gray.500" }}
                          >
                            Nenhuma história neste grupo ainda. Arraste uma
                            história para cá ou crie uma nova.
                          </Text>
                        ) : (
                          <Grid gap="3">
                            {groupStories.map((story) => (
                              <StoryList
                                key={story.id}
                                story={story}
                                isMobile={isMobile}
                                shouldRefetch={() => refetch()}
                              />
                            ))}
                          </Grid>
                        )}
                      </Card.Body>
                    </Card.Root>
                  );
                })}
                {storiesWithoutGroup.length > 0 && (
                  <Card.Root
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={{ base: "gray.200", _dark: "gray.800" }}
                    bg={{ base: "white", _dark: "gray.900" }}
                  >
                    <Card.Header
                      py="2.5"
                      px="3"
                      borderBottomWidth="1px"
                      borderColor={{ base: "gray.100", _dark: "gray.800" }}
                    >
                      <HStack justify="space-between" w="100%">
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color={{ base: "gray.800", _dark: "gray.100" }}
                        >
                          Histórias sem grupo
                        </Text>
                        <Button
                          size="xs"
                          variant="ghost"
                          onClick={() => {
                            setCreatingStoryGroupId(null);
                            setIsCreatingStory(true);
                          }}
                        >
                          <Plus size={14} />
                          História
                        </Button>
                      </HStack>
                    </Card.Header>
                    <Card.Body
                      px="3"
                      py="3"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropOnGroup(e, null)}
                    >
                      <Grid gap="3">
                        {storiesWithoutGroup.map((story) => (
                          <StoryList
                            key={story.id}
                            story={story}
                            isMobile={isMobile}
                            shouldRefetch={() => refetch()}
                          />
                        ))}
                      </Grid>
                    </Card.Body>
                  </Card.Root>
                )}
              </Stack>
            )}
            <CreateStory
              isOpen={isCreatingStory}
              onClose={() => setIsCreatingStory(false)}
              storyGroupId={creatingStoryGroupId}
            />
            <CreateStoryGroup
              isOpen={isCreatingGroup}
              onClose={() => setIsCreatingGroup(false)}
            />
            <UpdateStoryGroup
              isOpen={isEditingGroupOpen}
              onClose={() => setIsEditingGroupOpen(false)}
              group={editingGroup}
            />
          </>
        )}
      </Box>
    </Container>
  );
}
