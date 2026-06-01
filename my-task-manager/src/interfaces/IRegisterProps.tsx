import type { TranslationType } from "./IFilterMenuProps";


export interface IRegisterProps {
    t: TranslationType;
    onRegisterSuccess: (token: string) => void;
}