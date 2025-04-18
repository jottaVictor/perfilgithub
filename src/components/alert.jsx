import React from 'react'
import '@components/alert.css'

export default function Alert(
    {
        text = ''
    }
) {

    return(
        <div className="alert">
            <p>{text}</p>
        </div>
    )
}