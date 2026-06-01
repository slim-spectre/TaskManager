import {en} from '../locales/en';

export type TranslationType = typeof en.translation;



export interface IFilterMenuProps  {
    currentFilter: "All" | 'Active' | 'Completed';
    onFilterChanged: (newFilter: 'All' | 'Active' | "Completed") => void;
    t:TranslationType;
}