export type DataStructureId = 'stack' | 'queue' | 'linked_list' | 'binary_search_tree' | 'hash_table' | 'graph';

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
