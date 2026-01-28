interface Props {
    filters: string[]
    removeFilter: (filter: string) => void
    clearFilters: () => void
}

export default function FilterBar({ filters, removeFilter, clearFilters} : Props) {
    if(filters.length === 0) return null

    return (
        <div className="bg-white shadow-xl shadow-teal-700/10 p-5 flex justify-between items-center max-w-5xl mx-auto mt-8 rounded font-league-spartan">
            <div className="flex gap-5 flex-wrap">
                {filters.map((filter) => (
                    <span
                        key={filter}
                        className="bg-gray-100 text-teal-700/70 font-semibold rounded flex items-center gap-5 pl-3 py-1 text-sm"
                    >
                        {filter}
                        <button 
                            onClick={() => removeFilter(filter)}
                            className="cursor-pointer bg-teal-700/62 text-white px-2 py-0.4 rounded-sm text-lg hover:bg-gray-700"
                        >
                            X
                        </button>
                    </span>
                ))}
            </div>
            <button
                onClick={clearFilters}
                className="text-teal-700/62 font-semibold cursor-pointer"
            >
                Clear
            </button>
        </div>
    )
}
