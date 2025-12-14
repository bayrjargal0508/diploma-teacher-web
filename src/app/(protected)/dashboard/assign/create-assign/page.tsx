"use client";

import CreateAssign from '@/components/dashboard/assign/create-assign'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AllExamContent } from '@/lib/types'
import { manageAllSubjectContentName } from '@/actions'
import { ExamContent } from '@/lib/types'
import MonsterLottie from '@/components/ui/loader'

const CreateAssignPage = () => {
  const searchParams = useSearchParams()
  const contentId = searchParams.get('id')
  const [contentItem, setContentItem] = useState<Pick<ExamContent, "id" | "name"> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      if (!contentId) {
        setError("Агуулгын ID олдсонгүй")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const contentData = await manageAllSubjectContentName()
        if (contentData?.list) {
          const foundContent = contentData.list.find((item: AllExamContent) => item.id === contentId)
          
          if (foundContent) {
            setContentItem({
              id: foundContent.id,
              name: foundContent.name
            })
          } else {
            setError(`Агуулга олдсонгүй (ID: ${contentId})`)
          }
        } else {
          setError("Агуулгын мэдээлэл татахад алдаа гарлаа")
        }
      } catch (err) {
        console.error("Content load error:", err)
        setError("Агуулгын мэдээлэл татахад алдаа гарлаа")
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [contentId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background rounded-[10px]">
        <MonsterLottie />
      </div>
    )
  }

  if (error || !contentItem) {
    return (
      <div className="flex items-center justify-center h-screen bg-background rounded-[10px]">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">{error || "Агуулгын мэдээлэл олдсонгүй"}</p>
        </div>
      </div>
    )
  }

  return (
    <div><CreateAssign contentItem={contentItem} /></div>
  )
}

export default CreateAssignPage