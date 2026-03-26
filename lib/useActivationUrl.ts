'use client'

import { useEffect, useState } from 'react'

const DEFAULT_URL = 'https://chong.plus'

let cachedUrl: string | null = null

export function useActivationUrl() {
  const [url, setUrl] = useState(cachedUrl || DEFAULT_URL)

  useEffect(() => {
    if (cachedUrl) return

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.activation_url) {
          cachedUrl = data.activation_url
          setUrl(data.activation_url)
        }
      })
      .catch(() => {})
  }, [])

  return url
}
