import axios from 'axios'
import { useState } from 'react'

type HomeProps = {
	onAbrirDetalhes: (imdbID: string) => void
}

function Home({ onAbrirDetalhes }: HomeProps) {
	const chave = import.meta.env.VITE_API_KEY
	const [filmes, setFilmes] = useState<any[]>([])
	const [nomeFilme, setNomeFilme] = useState('')
	const [carregando, setCarregando] = useState(false)
	const [mensagem, setMensagem] = useState('')

	const buscaFilme = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!nomeFilme.trim()) {
			setFilmes([])
			setMensagem('Digite um titulo para comecar a busca.')
			return
		}

		try {
			setCarregando(true)
			setMensagem('')
			const resposta = await axios.get(
				`https://www.omdbapi.com/?apikey=${chave}&s=${encodeURIComponent(nomeFilme.trim())}`
			)
			setFilmes(resposta.data.Search ?? [])
			setMensagem(resposta.data.Search ? '' : 'Nenhum filme encontrado. Tente outro titulo.')
		} catch (error) {
			console.error('erro ao buscar filmes:', error)
			setFilmes([])
			setMensagem('Nao foi possivel carregar os filmes agora.')
		} finally {
			setCarregando(false)
		}
	}

	return (
		<main className="app-shell">
			<header className="hero">
				<h1>REACT PRIME</h1>

				<form className="search-bar" onSubmit={buscaFilme}>
					<label htmlFor="nome-filme">Pesquisar por titulo</label>
					<div className="search-controls">
						<input
							id="nome-filme"
							type="search"
							value={nomeFilme}
							onChange={(event) => setNomeFilme(event.target.value)}
							placeholder="Ex.: O Poderoso Chefao"
							aria-label="Nome do filme"
							required
						/>
						<button type="submit" disabled={carregando}>
							{carregando ? 'Buscando...' : 'Buscar'}
						</button>
					</div>
				</form>
			</header>

			<section className="results" aria-live="polite">
				<div className="section-heading">
					<div>
						<p className="eyebrow">Resultados da busca</p>
						<h2>{filmes.length ? `${filmes.length} filmes encontrados` : 'Sua lista aparece aqui'}</h2>
					</div>
					<span className="result-count">{String(filmes.length).padStart(2, '0')}</span>
				</div>

				{mensagem && <p className="feedback">{mensagem}</p>}

				<div className="movie-grid">
					{filmes.map((filme) => (
						<button
							className="movie-card"
							key={filme.imdbID}
							type="button"
							onClick={() => onAbrirDetalhes(filme.imdbID)}
							aria-label={`Ver detalhes de ${filme.Title}`}
						>
							<div className="poster-wrap">
								<img
									src={filme.Poster !== 'N/A' ? filme.Poster : undefined}
									alt={`Poster de ${filme.Title}`}
								/>
								{filme.Poster === 'N/A' && <span>Poster indisponivel</span>}
							</div>
							<div className="movie-info">
								<h3>{filme.Title}</h3>
								<p>{filme.Year} <span>/</span> {filme.Type}</p>
							</div>
						</button>
					))}
				</div>
			</section>
		</main>
	)
}

export default Home
