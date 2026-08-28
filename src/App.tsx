import './App.css'
import { useEffect, useState } from 'react'
import Detalhes from './pages/Detalhes'
import Home from './pages/Home'

function App() {
  const caminhoInicial = window.location.pathname.match(/^\/filme\/([^/]+)$/)
  const [filmeSelecionado, setFilmeSelecionado] = useState(caminhoInicial?.[1] ?? null)

  useEffect(() => {
    const sincronizarRota = () => {
      const caminho = window.location.pathname.match(/^\/filme\/([^/]+)$/)
      setFilmeSelecionado(caminho?.[1] ?? null)
    }

    window.addEventListener('popstate', sincronizarRota)
    return () => window.removeEventListener('popstate', sincronizarRota)
  }, [])

  const abrirDetalhes = (imdbID: string) => {
    window.history.pushState({}, '', `/filme/${imdbID}`)
    setFilmeSelecionado(imdbID)
  }

  const voltarParaBusca = () => {
    window.history.pushState({}, '', '/')
    setFilmeSelecionado(null)
  }

  if (filmeSelecionado) {
    return <Detalhes imdbID={filmeSelecionado} onVoltar={voltarParaBusca} />
  }
 
  return <Home onAbrirDetalhes={abrirDetalhes} />
}

export default App
