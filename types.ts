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
