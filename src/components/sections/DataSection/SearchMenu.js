import SearchBox from "./SearchBox";


const SearchMenu = ({data}) => {
    
    return (
        <div className="flex flex-col gap-3">
            {
                data.map((value,index) => {
                    return (
                        <SearchBox key={index} name={value.label} data={value} />
                        
                    )
                })
            }
        </div>
    )
}

export default SearchMenu;