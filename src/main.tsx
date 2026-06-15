import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { initializeWidgets } from './registry/init'

// @ts-ignore Polyfill findDOMNode for react-draggable in React 19
if (!ReactDOM.findDOMNode) {
  // @ts-ignore
  ReactDOM.findDOMNode = (node: any) => {
    if (node instanceof HTMLElement) return node;
    if (node?.current instanceof HTMLElement) return node.current;
    if (node?.nodeRef?.current instanceof HTMLElement) return node.nodeRef.current;
    return null;
  };
}

initializeWidgets()

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
