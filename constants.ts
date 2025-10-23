import { DataStructureId } from './types';

interface DataStructure {
    id: DataStructureId;
    name: string;
}

export const DATA_STRUCTURES: DataStructure[] = [
  { id: 'stack', name: 'Stack' },
  { id: 'queue', name: 'Queue' },
  { id: 'linked_list', name: 'Linked List' },
  { id: 'binary_search_tree', name: 'Binary Search Tree' },
  { id: 'hash_table', name: 'Hash Table' },
  { id: 'graph', name: 'Graph' },
];
