
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/base.css'
import './styles/cards.css'
import './styles/navigation.css'
import './styles/scrollbars.css'
import './styles/tags.css'
import './styles/whatsapp.css'
import './styles/kanban.css'
import './styles/animations.css'
import './styles/radix-overrides.css'
import './styles/responsive.css'
import './styles/theme.css'
import './styles/spreadsheet.css'
import { ThemeProvider } from './hooks/useThemeManager'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
