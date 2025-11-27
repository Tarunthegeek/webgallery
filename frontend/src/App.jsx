import { useState, useEffect } from 'react'
import axios from 'axios'
import ImageGallery from './components/ImageGallery'
import UploadForm from './components/UploadForm'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchImages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/images`)
      setImages(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load images')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleUploadSuccess = () => {
    fetchImages()
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/images/${id}`)
      fetchImages()
    } catch (err) {
      setError('Failed to delete image')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">Web Gallery</h1>
          <p className="text-gray-600">Upload, view, and download your images</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <UploadForm onUploadSuccess={handleUploadSuccess} />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading images...</p>
          </div>
        ) : (
          <ImageGallery images={images} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}

export default App

