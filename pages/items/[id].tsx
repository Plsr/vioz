import { useRouter } from 'next/router'
import { useQuery, useQueries } from '@tanstack/react-query'
import { fetchItem } from '../../util/api'
import ItemTitle from '../../components/item-title'
import { createdAgo } from '../../util/time'
import Layout from '../../components/layout'
import Comment from '../../components/comment'

/** TODO:
 * - Move comment to distinct component
 * - Plural/Singular for children
 * - Hide children thing if no children present
 * - Hide 'dead' comments
 * - Load children on click
 */
export default function Item({}) {
  const router = useRouter()
  const { id: itemId } = router.query

  const {
    isLoading: isLoadingItem,
    isError,
    error,
    data: item,
  } = useQuery(['item', itemId], () => fetchItem(+itemId!))

  const commentData = useQueries({
    queries:
      item?.kids?.map((itemId) => ({
        queryKey: ['item', itemId],
        queryFn: () => fetchItem(itemId),
        enabled: !!item,
      })) || [],
  })

  const allCommentsSuccess =
    commentData &&
    commentData.every(
      (comment) => comment.isSuccess === true && comment.data != undefined
    )

  if (isLoadingItem) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    )
  }

  if (isError || !item) {
    if (error instanceof Error) return <p>{error.message}</p>
    return <p>Something went wrong</p>
  }

  return (
    <Layout>
      <div className="p-2">
        <ItemTitle
          id={item.id}
          url={item.url}
          title={item.title}
          linkable={false}
        />
        <div className="text-slate-500 text-xs">
          <span>by {item.by}</span>
          <span> {createdAgo(item.time)}</span>
        </div>
        <h2 className="text-md mt-12 mb-4 font-bold">
          Comments ({item.kids.length})
        </h2>
        {allCommentsSuccess &&
          commentData.map((comment) => (
            <Comment key={comment.data!.id} comment={comment.data!} />
          ))}
      </div>
    </Layout>
  )
}
