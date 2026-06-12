import React from 'react'

// Removed the default template sidebar layout (Categories, FilterList, Search wrapper)
// All filtering/search/sort is now handled inline in the shop page header
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
