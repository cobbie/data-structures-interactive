export type Difficulty = 'easy' | 'medium' | 'hard';

export type DataStructureId =
  | 'array'
  | 'stack'
  | 'queue'
  | 'linked_list'
  | 'hash_table'
  | 'tree'
  | 'binary_tree'
  | 'binary_search_tree'
  | 'heap'
  | 'graph'
  | 'trie'
  | 'self_balancing_bst'
  | 'dsu'
  | 'segment_tree';

export interface DSInfo {
  description: string;
  theory: {
    timeComplexity: string;
    spaceComplexity: string;
    useCases: string;
    realWorldExamples: string;
  };
}

export interface BstNode {
  value: number;
  id: number;
  left: BstNode | null;
  right: BstNode | null;
}

export interface TreeNode {
  id: number;
  value: number;
  children: TreeNode[];
}

export interface AvlNode {
  value: number;
  id: number;
  left: AvlNode | null;
  right: AvlNode | null;
  height: number;
}

export interface TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;
  id: string; 
}

export type ComplexityClass = 
  | 'O(1)' 
  | 'O(log n)' 
  | 'O(n)' 
  | 'O(n log n)' 
  | 'O(n^2)' 
  | 'O(2^n)' 
  | 'O(n!)';
