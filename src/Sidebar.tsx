interface SidebarProps {
    currentPage: string;
    onChangePage: (page: "home" | "laba1" | "laba2" | "laba3") => void
}

export function Sidebar({currentPage: activePage, onChangePage}: SidebarProps) {
    return (
    <div className="bg-sidebar w-70 h-screen flex flex-col justify-start  ">
        <button className="
            text-xl 
            py-3 
            text-white
            border-black 
            hover:bg-hover-button" 
        onClick={() => onChangePage("home")}>Домой, Уолтер</button>
        <div className="
            gap-5
            flex
            flex-row
            justify-center
            items-center
            text-xl 
            
            text-white
            border-black 
            hover:bg-hover-button" 
        onClick={() => onChangePage("laba1")}>
            <img className="w-15 h-15" src="74ec668704f6caa3b0547b9162d799cd (1).jpg"></img>
            <p>Первая лаба</p></div>
        <img  src="d097887dd6d1e64a2781b7901e448c84.jpg" className="mt-auto"></img>
    </div>
)
}

export default Sidebar