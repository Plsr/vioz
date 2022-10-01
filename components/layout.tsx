import Head from 'next/head'
import SidebarContent from './sidebar-content'

export default function Layout({ children }: props) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="flex h-screen">
          <div className="sticky h-full bg-slate-100 w-60">
            <SidebarContent />
          </div>
          <div className="h-full flex-1 px-8 overflow-scroll">{children}</div>
        </div>
      </main>
    </div>
  )
}

interface props {
  children: JSX.Element | JSX.Element[]
}
