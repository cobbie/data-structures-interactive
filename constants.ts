import { DataStructureId, Difficulty } from './types';

export interface DataStructure {
    id: DataStructureId;
    name: string;
    difficulty: Difficulty;
}

export const DATA_STRUCTURES: DataStructure[] = [
  // Easy
  { id: 'array', name: 'Array', difficulty: 'easy' },
  { id: 'stack', name: 'Stack', difficulty: 'easy' },
  { id: 'queue', name: 'Queue', difficulty: 'easy' },
  { id: 'linked_list', name: 'Linked List', difficulty: 'easy' },
  // Medium
  { id: 'hash_table', name: 'Hash Table', difficulty: 'medium' },
  { id: 'tree', name: 'Tree', difficulty: 'medium' },
  { id: 'binary_tree', name: 'Binary Tree', difficulty: 'medium' },
  { id: 'binary_search_tree', name: 'Binary Search Tree', difficulty: 'medium' },
  { id: 'heap', name: 'Heap (Priority Queue)', difficulty: 'medium' },
  { id: 'graph', name: 'Graph', difficulty: 'medium' },
  { id: 'trie', name: 'Trie (Prefix Tree)', difficulty: 'medium' },
  // Hard
  { id: 'self_balancing_bst', name: 'Self-Balancing BST', difficulty: 'hard' },
  { id: 'dsu', name: 'Disjoint Set Union', difficulty: 'hard' },
  { id: 'segment_tree', name: 'Segment Tree', difficulty: 'hard' },
];
