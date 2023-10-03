import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowRight, LogIn } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function Home() {
  const {userId} = await auth()
  const isAuth = !!userId
  let firstChat
  if(userId){
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId))
    if(firstChat){
      firstChat = firstChat[0]
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-t from-blue-100 via-blue-300 to-blue-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">

          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with our chatbot</h1>
            <UserButton afterSignOutUrl="/"/>
          </div>

          <div className="flex-col mt-2">
            <p className='max-w-xl mt-1 mb-3 text-lg text-slate-800'>
              Ask anything and our chatbot will answer it for you
            </p>

            {
            isAuth && firstChat && 
            <Link href={`/chat/${firstChat.id}`}>
              <Button>Go To Chats <ArrowRight className="ml-2"/> </Button>
            </Link>
            }
          
            <div className="w-full mt-4">
              {isAuth? (
                <FileUpload></FileUpload>
                ) : (
                  <Link href="/sign-in">
                    <Button>Login to get Started
                      <LogIn className='w-4 h-4 ml-2'/>
                    </Button>
                  </Link>
                )  
              }
            </div>

          </div>
        </div>
      </div>
      <Link href="https://www.dndlab.org/">
        <p 
        className='text-slate-800 absolute bottom-0 mb-2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          Made as demo by DnDLab.org
        </p>
      </Link>
    </div>
  )
}
