'use client'

import { useEffect, useState } from 'react'

export function DynamicContent() {
  const [content, setContent] = useState<React.ReactNode>(null)
  
  useEffect(() => {
    // Only run on the client after hydration
    setContent(
      <div>
        {/* Your dynamic content here */}
        <span>{Math.floor(Math.random() * 24)}h ago</span>
      </div>
    )
  }, [])
  
  // Return empty div during server rendering and initial hydration
  if (!content) {
    return <div className="h-[24px]"></div>
  }
  
  return content
} 