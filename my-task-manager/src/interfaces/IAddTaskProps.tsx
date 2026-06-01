import type { TranslationType } from "./IFilterMenuProps";


export interface IAddTaskProps {
    onAdd: (title:string,description:string,priority:string) => void;
    t: TranslationType;
}