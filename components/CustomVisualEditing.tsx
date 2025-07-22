'use client'

import { useState, useEffect } from 'react'
import { sanityClientAuth } from '@/lib/sanity'

interface EditingModal {
  isOpen: boolean
  field: string
  value: string
  documentId: string
  fieldPath: string
}

export default function CustomVisualEditing() {
  const [modal, setModal] = useState<EditingModal>({
    isOpen: false,
    field: '',
    value: '',
    documentId: '',
    fieldPath: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!editMode) return
      
      const target = event.target as HTMLElement
      const sanityData = target.getAttribute('data-sanity')
      
      if (sanityData) {
        event.preventDefault()
        event.stopPropagation()
        
        // Parse the data-sanity attribute
        const parts = sanityData.split('.')
        const documentId = parts[0]
        const fieldPath = parts.slice(1).join('.')
        
        // Get current value from the element
        const currentValue = target.textContent || target.getAttribute('alt') || ''
        
        setModal({
          isOpen: true,
          field: fieldPath,
          value: currentValue,
          documentId,
          fieldPath: sanityData
        })
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle edit mode with Ctrl+E
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault()
        setEditMode(!editMode)
      }
      
      // Exit edit mode with Escape
      if (event.key === 'Escape') {
        setEditMode(false)
        setModal(prev => ({ ...prev, isOpen: false }))
      }
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editMode])

  const handleSave = async () => {
    if (!modal.documentId || !modal.fieldPath) return
    
    setIsLoading(true)
    
    try {
      // Create the patch object for the specific field
      const fieldParts = modal.fieldPath.split('.').slice(1) // Remove document ID
      const patchData: any = {}
      
      // Handle nested field paths
      if (fieldParts.length === 1) {
        patchData[fieldParts[0]] = modal.value
      } else {
        // For nested fields like content[0].headline
        const [arrayField, index, ...restPath] = fieldParts
        if (arrayField && index !== undefined) {
          const arrayIndex = parseInt(index.replace(/[\[\]]/g, ''))
          if (!isNaN(arrayIndex)) {
            patchData[`${arrayField}[${arrayIndex}].${restPath.join('.')}`] = modal.value
          }
        }
      }

      // Update the document via Sanity API
      await sanityClientAuth
        .patch(modal.documentId)
        .set(patchData)
        .commit()

      // Refresh the page to show changes
      window.location.reload()
      
    } catch (error) {
      console.error('Failed to update document:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <>
      {/* Edit Mode Toggle */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 10000,
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setEditMode(!editMode)}
          style={{
            background: editMode ? '#22c55e' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease'
          }}
        >
          {editMode ? '✏️ Edit ON' : '✏️ Edit OFF'}
        </button>
        {editMode && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            whiteSpace: 'nowrap'
          }}>
            Click any text to edit • Ctrl+E to toggle • ESC to exit
          </div>
        )}
      </div>

      {/* Editing Overlay */}
      {editMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(34, 197, 94, 0.1)',
          pointerEvents: 'none',
          zIndex: 9999,
          border: '3px solid #22c55e',
          borderRadius: '8px'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#22c55e',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            pointerEvents: 'auto'
          }}>
            🎯 VISUAL EDITING MODE ACTIVE
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '70vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                Edit: {modal.field}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Content:
              </label>
              <textarea
                value={modal.value}
                onChange={(e) => setModal(prev => ({ ...prev, value: e.target.value }))}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={closeModal}
                disabled={isLoading}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                style={{
                  background: isLoading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isLoading && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                )}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              <strong>Document:</strong> {modal.documentId}<br />
              <strong>Field:</strong> {modal.fieldPath}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}