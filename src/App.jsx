import React, { useEffect, useState, useRef, useCallback } from 'react'
import LogoSystem from '@components/logo-system'
import SearchInput from '@components/search-input'
import Alert from '@components/alert'
import CardUser from '@components/card-user'
import './App.css'
import { useLoading } from '@contexts/loading'

function App() {
    
    const API_URL = import.meta.env.VITE_GIT_API_URL
    const AUTH = import.meta.env.VITE_TOKEN_GITHUB
    
    const [userProfile, setUserProfile] = useState({})
    const [errorSearch, setErrorSearch] = useState(false)
    const [textAlert, setTextAlert] = useState('')
    const [cache, setCache] = useState({})
    const [history, setHistory] = useState([])
    
    console.log("rendering")
    console.log(cache)
    console.log(history)
    
    const { startLoading, stopLoading } = useLoading()

    const timeoutRef = useRef(null)

    const appendCacheHistory = (user) => {
        setHistory(prev => {
            const __history = [...prev]
            __history.push(user.login)

            setCache(prev => {
                const __cache = {
                    ...prev,
                    [user.login.toLowerCase()]: {
                        login: user.login,
                        name: user.name,
                        bio: user.bio,
                        avatar_url: user.avatar_url,
                        orderHistory: __history.length - 1
                    }
                }
                
                localStorage.setItem("cacheSearch", JSON.stringify(__cache))
                return __cache
            })
            return __history
        })

    }

    const updateOrderHistory = (userData) => {
        if(userData.orderHistory === history.length - 1)
            return

        if(Number.isFinite(userData.orderHistory) && history[userData.orderHistory].toLowerCase() !== userData.login.toLowerCase()){
            console.error('histórico corrompido')

            setHistory([])
            setCache(prev => {
                return Object.fromEntries(
                    Object.entries(prev).map(([key, value]) => {
                        return [key, {...value, orderHistory: undefined}]
                    })
                )
            })
            return
        }
        
        console.log("updating cache and history")
        setHistory(prev => {    
            const __history = [...prev]
            
            if(Number.isFinite(userData.orderHistory))
                __history[userData.orderHistory] = undefined

            __history.push(userData.login)
    
            return __history
        })
            
        setCache(prev => { 
            const __cache = {...prev}
            __cache[userData.login.toLowerCase()].orderHistory = history.length
            return __cache
        })
    }
    
    const onDeleteHistory = (orderHistory) => {
        if (!Number.isFinite(orderHistory)) return
        
            setHistory(prevHistory => {
            const newHist = [...prevHistory]
            newHist[orderHistory] = undefined
            return newHist
        })
        
        setCache(prevCache => {
        const key = history[orderHistory]?.toLowerCase()
        if (!key || !prevCache[key]) return prevCache
    
            return {
                ...prevCache,
                [key]: {
                    ...prevCache[key],
                    orderHistory: undefined
                }
            }
        })
        
        console.log("indice deletado", orderHistory)
    }
    
    const searchByCache = (user) => {
        console.log("trying search by cache with: ", user)

        if(!cache[user]){
            console.log("Didnt find in chache", cache)
            return false
        }
        
        setUserProfile(cache[user])
        setErrorSearch(false)
        
        updateOrderHistory(cache[user])

        return true
    }

    const onSearchByHistory = (orderHistory) => {
        setUserProfile(cache[history[orderHistory].toLowerCase()])
        setErrorSearch(false)
        updateOrderHistory(cache[history[orderHistory].toLowerCase()])
    }

    const onSearch = (user) => {

        console.log("searching, no cache temos", cache, "no history temos", history)
        if(!user.trim())
            return

        if(searchByCache(user.toLowerCase()))
            return

        startLoading()

        fetch(API_URL + `/users/${user}`, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: AUTH,
                'X-GitHub-Api-Version': '2022-11-28'
            }
            })
            .then(async (res) => {
                if(!res.ok){
                    const data = await res.json();

                    setUserProfile({})
                    if(data?.message?.startsWith("API rate limit exceeded")){
                        setTextAlert("Muitas requisições feitas, volte novamente mais tarde.")
                    }
                    else if(res.status === 404){
                        setTextAlert("Nenhum perfil foi encontrado com ese nome de usuário. Tente novamente")
                    }

                    throw new Error('Falha ao processar requisição')
                }

                return res.json()
            })
            .then((data) => {
                setUserProfile(data)
                setErrorSearch(false)
                appendCacheHistory(data)
            })
            .catch(err => {
                setErrorSearch(true)
            })
            .finally(() => {
                stopLoading()
            })
    }

    useEffect( () => {
        const __cache = JSON.parse(localStorage.getItem('cacheSearch') ?? '{}')
        
        //easter egg pra que tenha meu perfil no historico
        if(Object.keys(__cache).length === 0){
            setCache(() => {
                setHistory(['jottaVictor'])
                return {'jottavictor': {login: 'jottaVictor', name: 'João Victor Santos', bio: '', avatar_url: 'https://avatars.githubusercontent.com/u/72366793?v=4', orderHistory: 0}}
            })
            return
        }

        const __history = Object.values(__cache)
            .sort((a, b) => a.orderHistory - b.orderHistory)
            .map(user => user.login.toLowerCase())
        setHistory(__history)

        setCache(__cache)
    }, [AUTH, API_URL])

    useEffect(() => {
        if(errorSearch && (userProfile === null || Object.keys(userProfile).length === 0)  ){
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(() => {
                setErrorSearch(false)
                timeoutRef.current = null
            }, 3000)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [errorSearch, userProfile])

    return (
        <main>
            <div className="blur"></div>
            <div className="blur"></div>
            <section>
                <div className='box-logo'>
                    <LogoSystem></LogoSystem>
                </div>
                <div className='box-search'>
                    <SearchInput placeholder='Digite um usuário do Github' onSearch={onSearch} value={''} historyData={{history: history, onSearch: onSearchByHistory, onDeleteHistory: onDeleteHistory}}></SearchInput>
                </div>
                <div className={`box-alert ${errorSearch ? 'active' : ''}`}>
                    <Alert text={textAlert}></Alert>
                </div>
                <div className={`box-card ${userProfile !== null && Object.keys(userProfile).length > 0 ? 'active' : ''}`}>
                    <CardUser name={userProfile.name ?? userProfile.login} bio={userProfile.bio} urlImg={userProfile.avatar_url}></CardUser>
                </div>
            </section>
        </main>
    )
}

export default App
