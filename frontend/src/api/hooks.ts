// import { useMutation, useQueryClient} from '@tanstack/react-query';
// import { apiClient} from './client';
// import type { UseMutationOptions } from '@tanstack/react-query';
// import type {ApiError} from './client'
// import type { UserStats, Quest, ShopItem } from '../types';
//
//
// // Базовый хук для мутаций
// const useApiMutation = <TData, TVariables>(
//     mutationFn: (variables: TVariables) => Promise<TData>,
//     options?: UseMutationOptions<TData, ApiError, TVariables>
// ) => {
//     return useMutation<TData, ApiError, TVariables>(mutationFn, {
//         ...options,
//         onError: (error, variables, context) => {
//             console.error('API Error:', error.message);
//             options?.onError?.(error, variables, context);
//         }
//     });
// };
//
// Can you explain this... didn't get a thing...
//
// // Хук для создания пользователя
// export const useCreateUser = () => {
//     const queryClient = useQueryClient();
//
//     return useApiMutation<UserStats, { username: string }>(
//         ({ username }) => apiClient.post('/users', { username }),
//         {
//             onSuccess: () => {
//                 queryClient.invalidateQueries(['user-stats']);
//             }
//         }
//     );
// };
//
// // Хук для выполнения квеста
// export const useCompleteQuest = () => {
//     const queryClient = useQueryClient();
//
//     return useApiMutation<Quest, { questId: string }>(
//         ({ questId }) => apiClient.post(`/quests/${questId}/complete`),
//         {
//             onMutate: async ({ questId }) => {
//                 // Отменяем текущие запросы
//                 await queryClient.cancelQueries(['quests']);
//                 await queryClient.cancelQueries(['user-stats']);
//
//                 // Сохраняем предыдущее состояние
//                 const previousQuests = queryClient.getQueryData<Quest[]>(['quests']);
//                 const previousStats = queryClient.getQueryData<UserStats>(['user-stats']);
//
//                 // Оптимистичное обновление
//                 if (previousQuests) {
//                     queryClient.setQueryData(['quests'], previousQuests.filter(q => q.id !== questId));
//                 }
//
//                 return { previousQuests, previousStats };
//             },
//             onError: (error, variables, context) => {
//                 // Восстанавливаем предыдущее состояние при ошибке
//                 if (context?.previousQuests) {
//                     queryClient.setQueryData(['quests'], context.previousQuests);
//                 }
//             },
//             onSettled: () => {
//                 // Обновляем данные после мутации
//                 queryClient.invalidateQueries(['quests']);
//                 queryClient.invalidateQueries(['user-stats']);
//             }
//         }
//     );
// };
//
// // Хук для покупки награды
// export const useBuyReward = () => {
//     const queryClient = useQueryClient();
//
//     return useApiMutation<ShopItem, { rewardId: string }>(
//         ({ rewardId }) => apiClient.post(`/rewards/${rewardId}/buy`),
//         {
//             onMutate: async ({ rewardId }) => {
//                 await queryClient.cancelQueries(['rewards']);
//                 await queryClient.cancelQueries(['user-stats']);
//
//                 const previousRewards = queryClient.getQueryData<ShopItem[]>(['rewards']);
//                 const previousStats = queryClient.getQueryData<UserStats>(['user-stats']);
//                 const reward = previousRewards?.find(r => r.id === rewardId);
//
//                 // Оптимистичное обновление
//                 if (previousStats && reward) {
//                     queryClient.setQueryData(['user-stats'], {
//                         ...previousStats,
//                         gold: previousStats.gold - reward.cost
//                     });
//                 }
//
//                 return { previousRewards, previousStats };
//             },
//             onError: (error, variables, context) => {
//                 if (context?.previousStats) {
//                     queryClient.setQueryData(['user-stats'], context.previousStats);
//                 }
//             },
//             onSuccess: (data, variables) => {
//                 // Обновляем список наград
//                 queryClient.setQueryData<ShopItem[]>(['rewards'], (old) =>
//                     old?.filter(r => r.id !== variables.rewardId) || []
//                 );
//             },
//             onSettled: () => {
//                 queryClient.invalidateQueries(['rewards']);
//                 queryClient.invalidateQueries(['user-stats']);
//             }
//         }
//     );
// };
//
// // Хук для обновления статистики
// export const useUpdateStats = () => {
//     const queryClient = useQueryClient();
//
//     return useApiMutation<UserStats, Partial<UserStats>>(
//         (updates) => apiClient.put('/user_stats', updates),
//         {
//             onMutate: async (updates) => {
//                 await queryClient.cancelQueries(['user-stats']);
//
//                 const previousStats = queryClient.getQueryData<UserStats>(['user-stats']);
//
//                 if (previousStats) {
//                     queryClient.setQueryData(['user-stats'], {
//                         ...previousStats,
//                         ...updates
//                     });
//                 }
//
//                 return { previousStats };
//             },
//             onError: (error, variables, context) => {
//                 if (context?.previousStats) {
//                     queryClient.setQueryData(['user-stats'], context.previousStats);
//                 }
//             },
//             onSettled: () => {
//                 queryClient.invalidateQueries(['user-stats']);
//             }
//         }
//     );
// };