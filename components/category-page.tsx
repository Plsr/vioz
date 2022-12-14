import ItemList from './itemlist'
import { useQuery, useQueries } from '@tanstack/react-query'
import { fetchTopStories, fetchItem } from '../util/api'
import Layout from './layout'

const CategoryPage = ({ fetchFunction }: props) => {
  const {
    isError: isTopStoriesError,
    isLoading: isLoadingTopStories,
    data: topStoryIds,
    error: topStoriesError,
  } = useQuery(['topStories'], fetchFunction)

  const storyData = useQueries({
    queries:
      topStoryIds?.slice(0, 10)?.map((itemId) => ({
        queryKey: ['item', itemId],
        queryFn: () => fetchItem(itemId),
        enabled: !!topStoryIds,
      })) || [],
  })

  const allSuccess =
    storyData && storyData.every((story) => story.isSuccess === true)

  if (isTopStoriesError && topStoriesError instanceof Error) {
    return <p>{topStoriesError.message}</p>
  }

  return (
    <Layout>
      <>
        {!allSuccess && <p>Loading...</p>}
        {allSuccess && <ItemList items={storyData.map((sd) => sd.data!)} />}
      </>
    </Layout>
  )
}

export default CategoryPage

type props = {
  fetchFunction: () => Promise<number[]>
}
