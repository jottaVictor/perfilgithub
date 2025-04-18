import React, { useCallback, useState } from 'react'
import '@components/search-history.css'

export default function SearchHistory(
    {
        history = [],
        onSearch = () => {},
        onDelete = () => {},
        propToSearch,
        propToShow,
        deletedField
    }
) {
    const renderHistory = () => {
        const elements = []
    
        if (Array.isArray(history)) {
            for (let i = history.length - 1; i >= 0; i--) {
                const item = history[i]
                if(!item || (deletedField && !item[deletedField]))
                    continue
                elements.push(
                    <div key={i} className="item-history">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></svg>
                        <span title="Clique para pesquisar" onClick={() => onSearch(item[propToSearch] || i)}>{item[propToShow] || item}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" onClick={() => onDelete(i)}><title>Excluir do histórico</title><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </div>
                )
            }
        }
    
        else if (typeof history === 'object' && history !== null) {
            const entries = Object.entries(history)
            for (let i = entries.length - 1; i >= 0; i--) {
                const [key, item] = entries[i]
                if(deletedField && item[deletedField])
                    continue
                
                elements.push(
                    <div key={key} className="item-history">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z"/></svg>
                        <span title="Clique para pesquisar" onClick={() => onSearch(item[propToSearch] || key)}>{item[propToShow] || key}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" onClick={() => onDelete(item[propToSearch] || key)}><title>Excluir do histórico</title><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </div>
                )
            }
        }
    
        return elements
    }

    const items = renderHistory()

    if(items.length === 0)
        return(<></>)

    return(    
        <div className="search-history">
            {renderHistory()}
        </div>
    )
}