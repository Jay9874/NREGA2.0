import { useState, useEffect, useRef } from 'react'
import { authStore } from '../../api/store/authStore'

import './chatWidget.css'

export default function ChatWidget () {
  const { user } = authStore()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // One id per chat session, generated once when the widget first mounts.
  // The backend uses this to find (or create) the matching Foundry thread,
  // so the agent remembers earlier turns in this same conversation.
  const conversationIdRef = useRef(crypto.randomUUID())
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage (e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    if (!user) {
      setError('You need to be logged in to use the assistant.')
      return
    }

    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const API_URL = import.meta.env.DEV
        ? '/api/chat'
        : 'https://nregaagent.vercel.app/api/chat'
      const res = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationIdRef.current
        })
      })

      if (!res.ok) {
        console.log('something went wrong: ', res)
        throw new Error(`Request failed: ${res.status}`)
      }

      const data = await res.json()
      console.log('data: ', data)

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.answer }
      ])
      console.log('message: ', messages)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='chat-widget'>
      {isOpen ? (
        <div className='chat-widget-panel'>
          <div className='chat-widget-header'>
            <span>Ask about your account</span>
            <button onClick={() => setIsOpen(false)} aria-label='Close chat'>
              ×
            </button>
          </div>

          <div className='chat-widget-messages'>
            {messages.map((m, i) => (
              <div key={i} className={`chat-message chat-message-${m.role}`}>
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className='chat-message chat-message-assistant'>
                Thinking…
              </div>
            )}
            {error && (
              <div className='chat-message chat-message-error'>{error}</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className='chat-widget-input' onSubmit={sendMessage}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Ask a question…'
              disabled={isLoading}
            />
            <button type='submit' disabled={isLoading || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          className='chat-widget-launcher'
          onClick={() => setIsOpen(true)}
        >
          💬 Ask a question
        </button>
      )}
    </div>
  )
}
