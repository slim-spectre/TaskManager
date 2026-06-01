import type { IFilterMenuProps } from "../interfaces/IFilterMenuProps";


function FilterMenu({currentFilter,onFilterChanged,t} : IFilterMenuProps){
    
    return(
        <select value={currentFilter}
        className="filterMenu"
        onChange={(e) => onFilterChanged(e.target.value as 'All' | 'Active' | "Completed")}>
            <option value="All">{t.filtiries.All}</option>
            <option value="Active">{t.filtiries.Active}</option>
            <option value="Completed">{t.filtiries.Completed}</option>
        </select>
    );
}
export default FilterMenu   