import React from 'react'
import '@components/card-user.css'

export default function CardUser(
    {
        urlImg = '',
        name = '',
        bio = ''
    }
) {

    return(
        <div className="card-user">
            <img src={typeof urlImg === 'string' && urlImg.trim() !== '' ? urlImg : '/no-profile.png'} alt="Foto de Perfil" />
            <div className="informations">
                <h1>{name}</h1>
                <p>{(bio && bio.trim() !== '') ? bio : <strong>Usuário sem bio</strong>}</p>
            </div>
        </div>
    )
}