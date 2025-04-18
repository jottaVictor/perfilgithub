import React from 'react'
import '@components/loading.css'
import { useLoading } from '@contexts/loading'

export default function Loading() {
    const {isLoading} = useLoading()

    return(
        <div className={`loading-box ${(isLoading ? 'active': '')} `}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    )
}