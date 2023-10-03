## Information about the application

Demo website made as a part of DnD Lab Bangladesh for Bangladesh Muktijuddho Jadugor Education Project.

#### https://www.dndlab.org/

This website uses knowledge from PDF to feed into a chatbot which replies in Bangla and is able to do simple tasks such as data analysis and also extract out specific information from the pdf to the user.

## Screenshots

![Home Page](images/1.png?raw=true "Home Page")
![Chatbot Page](images/2.png?raw=true "Chatbot Page")
![Profile Page](images/3.png?raw=true "Profile Page")

## Technical Details
#### Tech Stacks
Next.js
Clerk Auth
DrizzleORM
Neon DB
AWS S3

#### AI Tech Stack
PineconeDB
Langchain
OpenAI
Vercel AI SDK

#### Hosting
Vercel

## Usage Instructions

use the commands in terminal

#### npm install
#### npm run dev

create a .env file with the following variables
#### Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

#### Neon DB
DATABASE_URL= YOUR_DATABASE_URL + sslmode=require

#### AWS S3
NEXT_PUBLIC_S3_ACCESS_KEY_ID
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
NEXT_PUBLIC_S3_BUCKET_NAME

#### Pinecone
PINECONE_ENVIRONMENT
PINECONE_API_KEY

#### Open AI
OPENAI_API_KEY