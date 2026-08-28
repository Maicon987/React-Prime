import axios from 'axios'
import { useEffect, useState } from 'react'

type DetalhesProps = {
	imdbID: string
	onVoltar: () => void
}

function Detalhes({ imdbID, onVoltar }: DetalhesProps) {
	const chave = import.meta.env.VITE_API_KEY
	const [filme, setFilme] = useState<any | null>(null)
	const [carregando, setCarregando] = useState(true)
	const [mensagem, setMensagem] = useState('')

	useEffect(() => {
		const buscarDetalhes = async () => {
			try {
				setCarregando(true)
				const resposta = await axios.get(
					`https://www.omdbapi.com/?apikey=${chave}&i=${encodeURIComponent(imdbID)}&plot=full`
				)

				if (resposta.data.Response === 'False') {
					setMensagem('Nao foi possivel encontrar os detalhes deste filme.')
					return
				}

				setFilme(resposta.data)
			} catch (error) {
				console.error('erro ao buscar detalhes:', error)
				setMensagem('Nao foi possivel carregar os detalhes agora.')
			} finally {
				setCarregando(false)
			}
		}

		buscarDetalhes()
	}, [chave, imdbID])

	return (
		<main className="app-shell details-page">
			<div className="details-content">
				<button className="back-button" type="button" onClick={onVoltar}>
					← Voltar para a busca
				</button>

				{carregando && <p className="feedback">Carregando detalhes...</p>}
				{mensagem && <p className="feedback">{mensagem}</p>}

				{filme && (
					<section className="details-layout" aria-labelledby="movie-title">
						<div className="details-poster poster-wrap">
							{filme.Poster !== 'N/A' ? <img src={filme.Poster} alt={`Poster de ${filme.Title}`} /> : <span>Poster indisponivel</span>}
						</div>
						<div className="details-copy">
							<p className="eyebrow">Detalhes do filme</p>
							<h1 id="movie-title">{filme.Title}</h1>
							<p className="details-meta">{filme.Year} <span>/</span> {filme.Runtime} <span>/</span> {filme.Genre}</p>
							<p className="details-plot">{filme.Plot}</p>
							<dl className="details-list">
								<div><dt>Diretor</dt><dd>{filme.Director}</dd></div>
								<div><dt>Elenco</dt><dd>{filme.Actors}</dd></div>
								<div><dt>Nota IMDb</dt><dd>{filme.imdbRating}</dd></div>
							</dl>
						</div>
					</section>
				)}
			</div>
		</main>
	)
}

export default Detalhes
