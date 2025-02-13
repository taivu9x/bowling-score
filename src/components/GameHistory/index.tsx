import dynamic from 'next/dynamic'
import { LoadingSpinner } from '../LoadingSpinner'

const GameHistoryClient = dynamic(
  () => import('./GameHistoryClient'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
)

export default GameHistoryClient; 