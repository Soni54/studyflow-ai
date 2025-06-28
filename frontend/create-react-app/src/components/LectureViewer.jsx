// frontend/src/components/LectureViewer.js
/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// In a real app, you might fetch a specific lecture if not populated in course details
// For simplicity, we'll assume lecture details come from CourseDetails via context/props or re-fetch

const LectureViewer = () => {
    const { id } = useParams(); // This 'id' would be the lecture ID
    const [lecture, setLecture] = useState(null); // In a full app, you'd fetch this
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Mock fetching lecture data (in a real app, you'd use courseService.getLectureById(id) if it existed)
        // For now, we'll just show placeholders or you can manually pass data from CourseDetails
        const fetchLectureDetails = async () => {
            // This is a placeholder. You'd typically have an API endpoint to get a single lecture by ID.
            // For now, assume a structure or expand your courseService.
            try {
                // Simulating an API call
                const mockLectureData = {
                    _id: id,
                    title: `Lecture ${id} Title`,
                    description: `Description for lecture ${id}. This is where the lecture content would be presented.`,
                    videoUrl: id === 'sample-video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : 'https://www.youtube.com/embed/some_other_video_id', // Replace with actual video embeds
                    content: `This is the detailed text content for lecture ${id}. Students can read along or refer to this.`,
                    order: 1
                };
                setLecture(mockLectureData);
            } catch (err) {
                setError('Failed to load lecture content.');
            } finally {
                setLoading(false);
            }
        };

        fetchLectureDetails();
    }, [id]);

    if (loading)
         return <div>Loading lecture...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
    if (!lecture) return <div>Lecture not found.</div>;

    return (
        <div className="max-w-4xl mx-auto my-8 p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">{lecture.title}</h2>
            <p >{lecture.description}</p>
            {lecture.videoUrl && (
                <div style={{ marginBottom: '20px' }}>
                    <h4 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Video Content:</h4>
                    <iframe
                        width="560"
                        height="315"
                        src={lecture.videoUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={lecture.title}
                    ></iframe>
                </div>
            )}
            {lecture.content && (
                <div>
                    <h4 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Text Content:</h4>
                    <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-6 rounded-md shadow-sm">{lecture.content}</p>
                </div>
            )}
        </div>
    );
};

export default LectureViewer;*/


/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const LectureViewer = () => {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLectureDetails = async () => {
      try {
        const mockLectureData = {
          _id: id,
          title: `Lecture ${id} Title`,
          description: `Description for lecture ${id}. This is where the lecture content would be presented.`,
          videoUrl:
            id === 'sample-video'
              ? 'https://www.youtube.com/embed/dQw4w9WgXcQ'
              : 'https://www.youtube.com/embed/some_other_video_id',
          content: `This is the detailed text content for lecture ${id}. Students can read along or refer to this.`,
          order: 1,
        };
        setLecture(mockLectureData);
      } catch (err) {
        setError('Failed to load lecture content.');
      } finally {
        setLoading(false);
      }
    };

    fetchLectureDetails();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading lecture...</p>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-md shadow-sm">
        Error: {error}
      </div>
    );

  if (!lecture)
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-yellow-100 text-yellow-700 rounded-md shadow-sm">
        Lecture not found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
        {lecture.title}
      </h2>
      <p className="text-gray-600 text-md mb-6 text-center">{lecture.description}</p>

      {lecture.videoUrl && (
        <div className="mb-8 flex justify-center">
          <iframe
            className="w-full max-w-3xl aspect-video rounded-lg shadow-md"
            src={lecture.videoUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={lecture.title}
          ></iframe>
        </div>
      )}

      {lecture.content && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Text Content</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{lecture.content}</p>
        </div>
      )}
    </div>
  );
};

export default LectureViewer;*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import courseService from '../services/courseService';

import ReactPlayer from 'react-player'; // ✅ Import added

const LectureViewer = () => {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLectureDetails = async () => {
      /*try {
        const mockLectureData = {
          _id: id,
          title: `Lecture ${id} Title`,
          description: `Description for lecture ${id}. This is where the lecture content would be presented.`,
          videoUrl:
            id === 'sample-video'
              ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              : 'https://www.youtube.com/watch?v=WJ-UaAaumNA',
          content: `This is the detailed text content for lecture ${id}. Students can read along or refer to this.`,
          order: 1,
        };
        setLecture(mockLectureData);
      } catch (err) {
        setError('Failed to load lecture content.');
      } finally {
        setLoading(false);
      }*/
      try {
      const data = await courseService.getLectureById(id);
      console.log('📚 Raw lecture response:', data);
      setLecture(data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load lecture content.');
    } finally {
      setLoading(false);
    }
    };

    fetchLectureDetails();
  }, [id]);



  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading lecture...</p>
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-md shadow-sm">
        Error: {error}
      </div>
    );

  if (!lecture)
    
    return (
  
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-yellow-100 text-yellow-700 rounded-md shadow-sm">
        Lecture not found.
      </div>
      
    );
    console.log('🎥 Video URL:', lecture.videoUrl);

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
        {lecture.title}
      </h2>
      <p className="text-gray-600 text-md mb-6 text-center">{lecture.description}</p>

      {lecture.videoUrl && (
        
  <div className="mb-8 flex justify-center">
    <ReactPlayer
       url={(() => {
    const baseUrl = lecture.videoUrl;
    if (baseUrl.startsWith('http')) {
      // Only keep the part before the first &
      const [cleanUrl] = baseUrl.split('&');
      return cleanUrl;
    }
    return `https://www.youtube.com/watch?v=${lecture.videoUrl}`;
  })()}
  
      controls
      width="100%"
      height="360px"
      className="rounded-lg shadow-md"
      onError={() => console.error('🚫 Invalid or broken video URL:', lecture.videoUrl)}
    />
  </div>
)}


      {lecture.content && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Text Content</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{lecture.content}</p>
        </div>
      )}
    </div>
  );
};

export default LectureViewer;
//new one




