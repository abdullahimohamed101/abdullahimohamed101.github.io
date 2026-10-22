import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CaseStudy from './CaseStudy.jsx'
import '../styles.css'
import './case-study.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaseStudy />
  </StrictMode>,
)
