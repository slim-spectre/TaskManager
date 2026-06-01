import type { TranslationType } from "./IFilterMenuProps";


export interface ILoginProps {
    t: TranslationType;
    onLoginSuccess: (token: string) => void;
}