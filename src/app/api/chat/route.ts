import {Configuration, OpenAIApi} from 'openai-edge'
import {OpenAIStream, StreamingTextResponse} from 'ai'
import { db } from '@/lib/db'
import { chats, messages as _messages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getContext } from '@/lib/context'
import { Message } from 'ai/react'
import { RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter'

export const runtime = 'edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200, });

export async function POST(req: Request) {
    try{
        const { messages, chatId } = await req.json()
        const _chats = await db.select().from(chats).where(eq(chats.id, chatId))
        if(_chats.length != 1){
            return NextResponse.json({'Error': 'Chat not found'}, {status: 404})
        }
        const fileKey = _chats[0].fileKey
        const lastMessage = messages[messages.length - 1]
        const context = await getContext(lastMessage.content, fileKey)

        const prompt = {
            role: 'system',
            content: `Assume you are an AI assistant who is a brand new, powerful, human-like artificial intelligence developed by DnD Lab Bangladesh as a demo for Bangladesh Muktijuddho Jadugor.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual and is made for teachers and students.
            AI will always try to reply shortly and to the point unless specified by the user not to do so.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
            AI assistant likes to interact in Bangla language and should always to talk in Bangla even if the user replies or talks in English.
            AI assistant should only use English if the user directly and explicitly tells it to speak in english.
            AI assistant is a big fan of Bangladeshi writer and political activist Jahanra Imam.
            AI assistant will analyze and respond from the CONTEXT BLOCK always in Bangla language.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the user asks anything about his class and students then always reply using data analyzed from the CONTEXT BLOCK.
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            `,
        }

        const userMessages = messages.filter((message: Message) => message.role === 'user');
        const combinedMessages = [prompt, ...userMessages];

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: combinedMessages,
            stream: true
        });

        const stream = OpenAIStream(response, {
            onStart: async () => {
                // save user meessage into db
                await db.insert(_messages).values({
                    chatId,
                    content: lastMessage.content,
                    role: 'user'
                })
            },
            onCompletion: async (completion) => {
                //save ai message into db
                await db.insert(_messages).values({
                    chatId,
                    content: completion,
                    role: 'system'
                })
            }
        })
        return new StreamingTextResponse(stream)
    }catch(error){

    }
}