import dynamic from 'next/dynamic'

const GameHistory = dynamic(() => import('./GameHistoryClient'), { ssr: false })

export default GameHistory; 