import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function ImageGallery({ images, onDelete }) {
  const [downloading, setDownloading] = useState(null)

  const handleDownload = async (image) => {
    try {
      setDownloading(image._id)
      const response = await axios.get(`${API_URL}/download/${image._id}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', image.originalName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download image')
    } finally {
      setDownloading(null)
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No images yet. Upload your first image!</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative aspect-square bg-gray-100">
              <img
                src={`http://localhost:5000/${image.path}`}
                alt={image.originalName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 truncate mb-2" title={image.originalName}>
                {image.originalName}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {(image.size / 1024).toFixed(2)} KB
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(image)}
                  disabled={downloading === image._id}
                  className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {downloading === image._id ? 'Downloading...' : 'Download'}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this image?')) {
                      onDelete(image._id)
                    }
                  }}
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery

