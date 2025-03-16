export type Message = {
    role: string
    content: string
    id?: string
  }
  
  export type ChatSession = {
    id: string
    title: string
    messages: Message[]
  }
  
  