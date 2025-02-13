import dynamic from 'next/dynamic'
import { LoadingSpinner } from '../LoadingSpinner'
const ScoreTableClient = dynamic(() => import('./ScoreTableClient'), { ssr: false, loading: () => <LoadingSpinner /> })

export default ScoreTableClient;  